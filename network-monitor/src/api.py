from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from typing import List, Dict, Any, Optional
import asyncio

from src.database import init_db, get_metrics, get_alerts
from src.monitor import start_monitor
from src.analyzer import analyze_traffic
from src.websocket_manager import manager

logger = logging.getLogger(__name__)

# Global stop event for monitor thread
stop_event = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for the application."""
    # Startup
    logger.info("Initializing database...")
    init_db()
    
    logger.info("Starting network monitor...")
    global stop_event
    
    import os
    if os.getenv("ENABLE_MONITOR", "true").lower() == "true":
        # Pass manager to monitor so it can broadcast
        loop = asyncio.get_running_loop()
        stop_event = start_monitor(interval=1, ws_manager=manager, main_loop=loop)
    else:
        logger.info("Network monitor disabled via ENABLE_MONITOR env var")

    # Start scheduler
    from src.scheduler.scheduler import scheduler
    scheduler.start()
    
    yield
    
    # Shutdown
    if stop_event:
        logger.info("Stopping network monitor...")
        stop_event.set()

app = FastAPI(title="Network Traffic Analyzer", lifespan=lifespan)

# CSP Middleware
@app.middleware("http")
async def add_csp_header(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: http:;"
    return response

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send last 30 records on connect
        history = get_metrics(limit=30)
        # We need to reverse to show oldest to newest? Or just send as is?
        # Typically charts want chronological. get_metrics returns DESC.
        # Let's send them as a specific message type
        await websocket.send_json({
            "type": "history",
            "data": history
        })
        
        while True:
            # Keep connection alive, maybe wait for commands?
            # For now just wait for disconnect
            try:
                data = await websocket.receive_text()
            except WebSocketDisconnect:
                manager.disconnect(websocket)
                break
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

@app.get("/api/stats")
async def get_stats(device_id: Optional[str] = Query(None)) -> Dict[str, Any]:
    """Get latest network statistics."""
    # database.get_metrics now returns InfluxDB data
    metrics = get_metrics(limit=60, device_id=device_id) 
    # Influx query returns flattened list of records.
    # We might want to organize this for the frontend? 
    # Frontend expects list of metrics.
    if not metrics:
        return {"current": None, "history": []}
        
    return {
        "current": metrics[0],
        "history": metrics
    }

@app.get("/api/history")
async def get_history(device_id: Optional[str] = Query(None)) -> List[Dict[str, Any]]:
    """Get historical network metrics."""
    return get_metrics(limit=100, device_id=device_id)

@app.get("/api/alerts")
async def get_alerts_endpoint(level: Optional[str] = Query(None), device_id: Optional[str] = Query(None)) -> List[Dict[str, Any]]:
    """Return active anomalies, optionally filtered by level."""
    # We should return stored alerts from DB now, not just re-analyze.
    # The requirement says "GET /api/alerts?level=HIGH"
    return get_alerts(level=level, device_id=device_id)

# Week 4: Prometheus & Analytics
from src.monitoring.prometheus_exporter import exporter
from fastapi.responses import PlainTextResponse
import src.api_analytics

@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return exporter.get_metrics()

app.include_router(src.api_analytics.router, prefix="/api", tags=["analytics"])

# Week 5: Authentication
import src.auth
app.include_router(src.auth.router, prefix="/api", tags=["authentication"])

# Phase 3: Data Ingestion
import src.ingest
app.include_router(src.ingest.router, prefix="/api/v1", tags=["ingestion"])

