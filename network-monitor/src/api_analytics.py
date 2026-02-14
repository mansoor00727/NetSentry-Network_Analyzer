from fastapi import APIRouter
from src.database import get_metrics
from src.ml.anomaly_detector import AnomalyDetector
from typing import Dict, Any, List

router = APIRouter(prefix="/analytics")

@router.get("/summary")
async def get_summary(days: int = 7, device_id: str = None):
    # Calculate start time
    from datetime import datetime, timedelta, timezone
    
    start_time = datetime.now(timezone.utc) - timedelta(days=days)
    
    # Get metrics from DB
    from src.database import get_aggregated_metrics
    
    stats = get_aggregated_metrics(start_time=start_time, device_id=device_id)
    
    return {
        "period": f"{days} days",
        "metrics": {
            "total_bytes_sent": stats.get("bytes_sent", 0),
            "total_bytes_recv": stats.get("bytes_recv", 0),
            "error_ratio": stats.get("error_ratio", 0)
        }
    }

@router.get("/trend")
async def get_trend(days: int = 7, device_id: str = None):
    from datetime import datetime, timedelta, timezone
    from src.database import get_timeseries_metrics
    
    start_time = datetime.now(timezone.utc) - timedelta(days=days)
    
    # Determine window based on range to avoid too many points
    window = "1h"
    if days <= 1:
        window = "5m"
    elif days > 7:
        window = "1d"
        
    data = get_timeseries_metrics(start_time, window=window, device_id=device_id)
    return {"trend": data}

@router.get("/predictions")
async def get_predictions(hours: int = 24):
    return {
        "forecast_horizon": f"{hours} hours",
        "predictions": []
    }

@router.post("/anomaly-explain")
async def explain_anomaly(request: Dict[str, Any]):
    return {
        "is_anomaly": True,
        "explanation": "Traffic spike detected"
    }

@router.get("/models")
async def get_ml_models():
    """Return status of ML models."""
    from src.ml.model_registry import ModelRegistry
    registry = ModelRegistry()
    return {
        "models": registry.list_models(),
        "ensemble_strategy": "voting_union",
        "last_full_retrain": "2026-02-13T00:00:00Z" # Dummy date for now
    }
