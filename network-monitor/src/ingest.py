from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import datetime

from src.auth import verify_api_key
from src.database import insert_metric

router = APIRouter()

class MetricPayload(BaseModel):
    interface: str
    bytes_sent: int
    bytes_recv: int
    packets_sent: int
    packets_recv: int
    err_in: int
    err_out: int
    drop_in: int
    drop_out: int
    timestamp: datetime.datetime = None

class IngestRequest(BaseModel):
    metrics: List[MetricPayload]

@router.post("/ingest", status_code=201)
async def ingest_metrics(
    payload: IngestRequest, 
    device_id: str = Depends(verify_api_key)
):
    """
    Ingest metrics from a remote probe.
    Requires X-API-Key header.
    """
    count = 0
    from src.websocket_manager import manager
    import asyncio
    
    # Process metrics
    for metric in payload.metrics:
        data = metric.dict()
        data["device_id"] = device_id # Ensure device_id is in the data
        
        insert_metric(data, device_id=device_id)
        count += 1
        
    # Broadcast to WebSocket
    # We broadcast the last metric as the "current" state
    if payload.metrics:
        latest = payload.metrics[-1].dict()
        latest["device_id"] = device_id
        
        await manager.broadcast({
            "type": "update",
            "timestamp": latest.get("timestamp"),
            "metrics": [latest],
            "device_id": device_id
        })
        
    return {"status": "success", "processed": count, "device_id": device_id}
