import os
import joblib
import json
import numpy as np
from datetime import datetime
from typing import Any, Dict, Optional, Tuple

# Hardcoded path for Docker environment to ensure it works
MODELS_DIR = "/app/src/ml/models"
METADATA_FILE = "metadata.json"

class ModelRegistry:
    def __init__(self, base_path: str = MODELS_DIR):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)
        
    def _get_model_dir(self, model_id: str) -> str:
        path = os.path.join(self.base_path, model_id)
        os.makedirs(path, exist_ok=True)
        return path
        
    def save_model(self, model_id: str, model: Any, metadata: Dict[str, Any], version: str = None) -> str:
        """Save a model and its metadata."""
        if not version:
            version = f"v{int(datetime.now().timestamp())}"
            
        model_dir = self._get_model_dir(model_id)
        
        # Save model artifact
        filename = f"{version}.pkl"
        filepath = os.path.join(model_dir, filename)
        
        # Determine how to save based on type
        # For TensorFlow/Keras, we might pass a path, or use .h5
        if hasattr(model, 'save'):
             # Keras/TF
             filename = f"{version}.h5"
             filepath = os.path.join(model_dir, filename)
             model.save(filepath)
        else:
             # Scikit-learn / Pickle
             joblib.dump(model, filepath)
             
        # Update metadata registry
        registry_path = os.path.join(model_dir, METADATA_FILE)
        registry = {}
        if os.path.exists(registry_path):
            with open(registry_path, 'r') as f:
                registry = json.load(f)
                
        registry[version] = {
            "created_at": datetime.now().isoformat(),
            "filepath": filename,
            **metadata
        }
        # Mark as latest
        registry["latest"] = version
        
        with open(registry_path, 'w') as f:
            json.dump(registry, f, indent=2)
            
        return version

    def load_model(self, model_id: str, version: str = "latest") -> Tuple[Any, Dict[str, Any]]:
        """Load a model and its metadata."""
        model_dir = self._get_model_dir(model_id)
        registry_path = os.path.join(model_dir, METADATA_FILE)
        
        if not os.path.exists(registry_path):
            raise FileNotFoundError(f"No registry found for model {model_id}")
            
        with open(registry_path, 'r') as f:
            registry = json.load(f)
            
        if version == "latest":
            version = registry.get("latest")
            if not version:
                raise ValueError("No latest version defined")
        
        if version not in registry:
            raise ValueError(f"Version {version} not found for model {model_id}")
            
        info = registry[version]
        filepath = os.path.join(model_dir, info["filepath"])
        
        # Load logic
        model = None
        if filepath.endswith(".h5") or filepath.endswith(".keras"):
            from tensorflow.keras.models import load_model
            model = load_model(filepath)
        elif filepath.endswith(".pkl"):
            model = joblib.load(filepath)
        else:
            raise ValueError(f"Unknown model file format: {filepath}")
            
        return model, info

    def list_models(self) -> Dict[str, Any]:
        """List all available models and versions."""
        result = {}
        if not os.path.exists(self.base_path):
            return result
            
        for model_id in os.listdir(self.base_path):
            model_dir = os.path.join(self.base_path, model_id)
            if os.path.isdir(model_dir):
                registry_path = os.path.join(model_dir, METADATA_FILE)
                if os.path.exists(registry_path):
                    with open(registry_path, 'r') as f:
                        result[model_id] = json.load(f)
        return result
