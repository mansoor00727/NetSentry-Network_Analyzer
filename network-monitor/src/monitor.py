import time
import psutil
import threading
import logging
import asyncio
from typing import Dict, Any, List, Optional
from src.database import insert_metric
# Analyzer will be updated to read from InfluxDB or we pass data? 
# In original code: new_alerts = analyze_traffic()
# analyze_traffic() called get_metrics() which read from DB.
# Now get_metrics() reads from InfluxDB. 
# So logic holds: Write to Influx -> Read from Influx -> Analyze.
# BUT InfluxDB might have slight delay. 
# Better to pass current metrics to analyzer? 
# For now let's stick to architecture: analyze_traffic() reads from DB.
from src.ml.anomaly_detector import AnomalyDetector
from src.ml.model_registry import ModelRegistry
from src.monitoring.prometheus_exporter import exporter
from src.analyzer import analyze_traffic as threshold_analyze
from src.websocket_manager import WebSocketManager
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Global ML components
registry = ModelRegistry()
detector = AnomalyDetector(registry)

def collect_metrics() -> List[Dict[str, Any]]:
    """
    Collect network metrics for all interfaces using psutil.
    Returns a list of dictionaries, one per interface.
    """
    metrics = []
    try:
        # Get IO counters for each interface
        net_io = psutil.net_io_counters(pernic=True)
        
        for interface, stats in net_io.items():
            metric = {
                "interface": interface,
                "bytes_sent": stats.bytes_sent,
                "bytes_recv": stats.bytes_recv,
                "packets_sent": stats.packets_sent,
                "packets_recv": stats.packets_recv,
                "err_in": stats.errin,
                "err_out": stats.errout,
                "drop_in": stats.dropin,
                "drop_out": stats.dropout
            }
            metrics.append(metric)
            
    except Exception as e:
        logger.error(f"Error collecting metrics: {e}")
        
    return metrics

def monitor_loop(interval: int, stop_event: threading.Event, ws_manager: Optional[WebSocketManager] = None, main_loop: Optional[asyncio.AbstractEventLoop] = None):
    """
    Continuous loop to collect, store, analyze, and broadcast metrics.
    Runs until stop_event is set.
    """
    logger.info(f"Starting network monitor (interval={interval}s)...")
    
    # We are in a separate thread. The WebSockets are bound to the main loop.
    # We must schedule broadcast on the main loop.
    
    prev_metrics = {} # Track previous for ML feature calc
    
    while not stop_event.is_set():
        try:
            metrics = collect_metrics()
            
            # Update Prometheus
            exporter.update_from_metrics(metrics)
            
            # Add timestamp to all metrics
            from datetime import datetime, timezone
            now = datetime.now(timezone.utc)
            iso_timestamp = now.isoformat()
            
            for m in metrics:
                m["timestamp"] = iso_timestamp

            current_alerts = []
            
            # 1. Store metrics
            for metric in metrics:
                insert_metric(metric)
            
            # 2. Analyze for alerts (ML + Threshold Fallback)
            new_alerts = []
            
            # Prepare for ML (per interface)
            for m in metrics:
                iface = m["interface"]
                prev = prev_metrics.get(iface)
                
                if prev:
                    # ML Prediction
                    try:
                        ml_result = detector.predict(m, prev)
                        if ml_result["is_anomaly"]:
                            # Create alert object
                            alert = {
                                "level": "CRITICAL" if ml_result.get("confidence", 0) > 0.8 else "HIGH",
                                "message": f"ML Anomaly detected on {iface}",
                                "timestamp": iso_timestamp,
                                "details": ml_result
                            }
                            # Insert to DB (needs explicit insert or rely on return?)
                            # Original analyze_traffic inserted to DB. 
                            # We should insert here or have a helper.
                            from src.database import insert_alert
                            insert_alert(alert)
                            new_alerts.append(alert)
                            
                            # Update Prometheus Anomaly Score
                            # Takes max score if multiple models?
                            # Exporter expects (interface, model) labels
                            if "isolation_forest" in ml_result["models"]:
                                score = ml_result["models"]["isolation_forest"]["score"]
                                exporter.anomaly_score.labels(interface=iface, model="isolation_forest").set(score)
                                
                    except Exception as e:
                        logger.error(f"ML prediction error: {e}")
                
                # Update prev
                prev_metrics[iface] = m
                
            # Fallback / Hybrid: Run threshold analysis too?
            # User says: "Fallback to threshold-based alerts if ML unavailable"
            # If no ML alerts, maybe run threshold? 
            # Or run both? "Ensemble voting: both models must agree".
            # Let's run threshold analysis as well for safety, it's cheap.
            threshold_alerts = threshold_analyze()
            new_alerts.extend(threshold_alerts)
            
            if new_alerts:
                logger.info(f"Generated {len(new_alerts)} alerts")
            
            # 3. Broadcast via WebSocket
            if ws_manager and main_loop:
                # Prepare data payload
                broadcast_data = {
                    "type": "update",
                    "timestamp": metrics[0]["timestamp"] if metrics else None,
                    "metrics": metrics,
                    "alerts": new_alerts,
                    "device_id": "server"
                }
                
                try:
                    asyncio.run_coroutine_threadsafe(ws_manager.broadcast(broadcast_data), main_loop)
                except Exception as e:
                    logger.error(f"Broadcast schedule error: {e}")

        except Exception as e:
            logger.error(f"Error in monitor loop: {e}")
            if ws_manager and main_loop:
                 try:
                    asyncio.run_coroutine_threadsafe(ws_manager.broadcast({"error": "Collection failed"}), main_loop)
                 except:
                     pass
            
        time.sleep(interval)


    
    logger.info("Network monitor stopped.")

def start_monitor(interval: int = 1, ws_manager: Optional[WebSocketManager] = None, main_loop: Optional[asyncio.AbstractEventLoop] = None) -> threading.Event:
    """
    Start the monitor loop in a background thread.
    Returns the stop_event to control the thread.
    """
    stop_event = threading.Event()
    thread = threading.Thread(target=monitor_loop, args=(interval, stop_event, ws_manager, main_loop), daemon=True)
    thread.start()
    return stop_event
