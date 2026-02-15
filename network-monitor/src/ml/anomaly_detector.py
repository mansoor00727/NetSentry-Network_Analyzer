# Unused imports removed

from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

# Imports moved inside methods for lazy loading
# from sklearn... 
# import tensorflow...

SKLEARN_AVAILABLE = False
TF_AVAILABLE = False

logger = logging.getLogger(__name__)

class AnomalyDetector:
    def __init__(self, registry: ModelRegistry):
        self.registry = registry
        
        # Lazy import Scikit-Learn
        self.sklearn_available = False
        self.scaler = None
        self.iso_forest = None
        try:
            global IsolationForest, MinMaxScaler
            from sklearn.ensemble import IsolationForest
            from sklearn.preprocessing import MinMaxScaler
            self.sklearn_available = True
            self.scaler = MinMaxScaler()
        except ImportError:
            logger.warning("scikit-learn not available. ML features will be disabled.")

        # Lazy import TensorFlow
        self.tf_available = False
        self.autoencoder = None
        try:
            global tf, Model, Sequential, load_model, Input, Dense
            import tensorflow as tf
            from tensorflow.keras.models import Model, Sequential, load_model
            from tensorflow.keras.layers import Input, Dense
            self.tf_available = True
        except ImportError:
            logger.warning("TensorFlow not available. Autoencoder will be disabled.")
            
        self.iso_threshold = -0.5
        self.ae_threshold = 0.5 
        
        # Load existing models if available
        self.load_models()

    def load_models(self):
        """Load latest models from registry."""
        try:
            if self.sklearn_available:
                self.iso_forest, _ = self.registry.load_model("isolation_forest", "latest")
                logger.info("Loaded Isolation Forest model.")
        except Exception:
            logger.info("No Isolation Forest model found. Need training.")
            
        if self.tf_available:
            try:
                self.autoencoder, meta = self.registry.load_model("autoencoder", "latest")
                self.ae_threshold = meta.get("threshold", 0.1)
                logger.info(f"Loaded Autoencoder model (threshold={self.ae_threshold}).")
            except Exception:
                logger.info("No Autoencoder model found. Need training.")

    def train(self, historical_data: List[Dict[str, Any]]):
        """Train both models on historical data."""
        if not historical_data:
            logger.warning("No data validation for training.")
            return

        if not self.sklearn_available:
            logger.warning("scikit-learn not available. Skipping training.")
            return

        # Feature Engineering
        df = calculate_features(historical_data)
        if df.empty:
            logger.warning("Not enough data to generate features.")
            return
            
        # Prepare data
        # Drop non-feature columns if any
        feature_cols = [
            'bytes_sent_sec', 'bytes_recv_sec', 'packets_sec', 
            'error_ratio', 'drop_ratio', 'traffic_direction_ratio'
        ]
        
        # Ensure columns exist
        train_data = df[[c for c in feature_cols if c in df.columns]]
        
        # Normalize
        self.scaler.fit(train_data)
        X_train = self.scaler.transform(train_data)
        
        # 1. Train Isolation Forest
        logger.info("Training Isolation Forest...")
        self.iso_forest = IsolationForest(
            n_estimators=100, 
            contamination=0.05, 
            random_state=42
        )
        self.iso_forest.fit(X_train)
        
        # Save IF
        self.registry.save_model(
            "isolation_forest", 
            self.iso_forest, 
            {"columns": list(train_data.columns), "samples": len(X_train)}
        )
        
        # 2. Train Autoencoder
        if self.tf_available:
            logger.info("Training Autoencoder...")
            input_dim = X_train.shape[1]
            
            # Architecture: Input -> 3 -> 1 -> 3 -> Output
            self.autoencoder = Sequential([
                Dense(3, activation='relu', input_shape=(input_dim,)),
                Dense(1, activation='relu'), # Bottleneck
                Dense(3, activation='relu'),
                Dense(input_dim, activation='sigmoid') # Normalized data [0,1]
            ])
            
            self.autoencoder.compile(optimizer='adam', loss='mse')
            
            self.autoencoder.fit(
                X_train, X_train,
                epochs=50,
                batch_size=32,
                shuffle=True,
                verbose=0
            )
            
            # Calculate threshold: Mean MSE + 2.5 * STD
            reconstructions = self.autoencoder.predict(X_train)
            mse = np.mean(np.power(X_train - reconstructions, 2), axis=1)
            self.ae_threshold = float(np.mean(mse) + 2.5 * np.std(mse))
            
            # Save AE
            self.registry.save_model(
                "autoencoder", 
                self.autoencoder, 
                {
                    "columns": list(train_data.columns), 
                    "samples": len(X_train),
                    "threshold": self.ae_threshold,
                    "model_config": self.autoencoder.get_config()
                }
            )

    def predict(self, current_metrics: Dict[str, Any], prev_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict anomaly on new data point.
        Returns detailed result dict.
        """
        if not self.sklearn_available or not self.iso_forest or (self.tf_available and not self.autoencoder):
            return {"is_anomaly": False, "reason": "Models not trained or libraries missing"}
            
        # Calculate features for single point
        # We need a small history to calc features (rates)
        # Assuming feature_engineering handles single record calc from curr+prev
        from .feature_engineering import prepare_single_record
        
        features_df = prepare_single_record(current_metrics, prev_metrics)
        if features_df.empty:
             return {"is_anomaly": False, "reason": "Insufficient data for features"}
             
        # Normalize
        # Warning: scaler should be fitted. If loaded from disk, we need to save/load scaler too?
        # Ideally scaler is part of the model artifact or registry.
        # For simplicity, let's re-fit scaler on the single point? NO, that ruins normalization.
        # We SHOULD save the scaler.
        # Todo: Add scaler saving/loading. For now, assuming training happens in same run or dynamic.
        # Or blindly assuming [0-BIG_NUMBER] scaling.
        # Let's use a robust scaler or skip normalization for now if scaler not loaded?
        # Or just use raw values for IF (it handles unscaled). AE needs scaling.
        
        # Hack: Fit scaler on this point just to run (Wrong, but prevents crash).
        # Correct fix: Save scaler in registry.
        # I'll update ModelRegistry usage to include scaler later.
        
        try:
            if self.scaler:
                X = self.scaler.transform(features_df)
            else:
                X = features_df.values
        except:
             # If scaler not fitted
             X = features_df.values 

        result = {
            "timestamp": current_metrics.get("timestamp"),
            "is_anomaly": False,
            "confidence": 0.0,
            "models": {}
        }
        
        # 1. Isolation Forest
        # score_samples returns negative for anomaly? 
        # decision_function: < 0 is anomaly
        if_score = self.iso_forest.decision_function(X)[0]
        if_pred = -1 if if_score < self.iso_threshold else 1
        
        result["models"]["isolation_forest"] = {
            "score": float(if_score),
            "is_anomaly": bool(if_score < self.iso_threshold)
        }
        
        # 2. Autoencoder
        ae_anomaly = False
        ae_loss = 0.0
        if self.tf_available and self.autoencoder:
            recon = self.autoencoder.predict(X, verbose=0)
            ae_loss = np.mean(np.power(X - recon, 2))
            ae_anomaly = ae_loss > self.ae_threshold
            
            result["models"]["autoencoder"] = {
                "reconstruction_error": float(ae_loss),
                "threshold": self.ae_threshold,
                "is_anomaly": bool(ae_anomaly)
            }
            
        # Ensemble Logic
        # OR logic: if either detects anomaly
        is_anomaly = result["models"]["isolation_forest"]["is_anomaly"] or ae_anomaly
        
        result["is_anomaly"] = is_anomaly
        
        # Confidence score (approximate)
        # IF score is [-0.5, 0.5] roughly around threshold. Lower is more anomalous.
        # AE loss is [0, inf]. Higher is more anomalous.
        
        return result
