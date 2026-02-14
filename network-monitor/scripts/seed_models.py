import os
import json
import sys
from datetime import datetime

# Adjust path to find src
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from src.ml.model_registry import ModelRegistry

def seed_models():
    registry = ModelRegistry()
    
    # Isolation Forest Dummy Data
    if_metadata = {
        "accuracy": 0.942,
        "precision": 0.915,
        "n_estimators": 100,
        "contamination": 0.05,
        "n_features": 12,
        "description": "Isolation Forest for anomaly detection on network flow features."
    }
    # Create a dummy model object (just a string for now as registry handles save logic differently)
    # Actually registry expects an object to save via joblib or keras.
    # We can bypass save and write metadata directly or use a dummy object.
    # Let's write metadata directly to simulate a saved model.
    
    models = {
        "isolation_forest": if_metadata,
        "autoencoder": {
            "accuracy": 0.895,
            "loss": 0.023,
            "architecture": "[12, 8, 4, 8, 12]",
            "n_features": 12,
            "description": "Deep Autoencoder for reconstructing normal traffic patterns."
        }
    }
    
    for model_id, meta in models.items():
        print(f"Seeding {model_id}...")
        model_dir = registry._get_model_dir(model_id)
        
        # Create a dummy version
        version = f"v{int(datetime.now().timestamp())}"
        
        # Create dummy artifact
        with open(os.path.join(model_dir, f"{version}.pkl"), "wb") as f:
            f.write(b"dummy model content")
            
        # Create metadata
        registry_path = os.path.join(model_dir, "metadata.json")
        data = {}
        if os.path.exists(registry_path):
            with open(registry_path, "r") as f:
                data = json.load(f)
                
        data[version] = {
            "created_at": datetime.now().isoformat(),
            "filepath": f"{version}.pkl",
            **meta
        }
        data["latest"] = version
        
        with open(registry_path, "w") as f:
            json.dump(data, f, indent=2)
            
    print("Seeding complete.")

if __name__ == "__main__":
    seed_models()
