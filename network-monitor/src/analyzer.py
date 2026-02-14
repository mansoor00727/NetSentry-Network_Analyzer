from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from src.database import get_metrics, insert_alert

# Thresholds (Week 2 Specs)
THRESHOLDS = {
    "CRITICAL": {"packets_sec": 8000, "errors": 500, "drops": 200},
    "HIGH": {"packets_sec": 5000, "errors": 200, "drops": 50},
    "MEDIUM": {"packets_sec": 2000, "errors": 100, "drops": 20},
    "LOW": {"packets_sec": 0, "errors": 1, "drops": 1} # Catch-all for minor issues
}

def calculate_rate(curr: Dict[str, Any], prev: Dict[str, Any]) -> Dict[str, float]:
    """Calculate the rate of change between two metric records."""
    dt_curr = datetime.fromisoformat(curr["timestamp"])
    dt_prev = datetime.fromisoformat(prev["timestamp"])
    
    # Ensure both are timezone-aware (assume UTC if naive)
    if dt_curr.tzinfo is None:
        dt_curr = dt_curr.replace(tzinfo=timezone.utc)
    if dt_prev.tzinfo is None:
        dt_prev = dt_prev.replace(tzinfo=timezone.utc)

    time_diff = (dt_curr - dt_prev).total_seconds()
    
    if time_diff <= 0:
        return {}

    packets_total_curr = (curr.get("packets_sent") or 0) + (curr.get("packets_recv") or 0)
    packets_total_prev = (prev.get("packets_sent") or 0) + (prev.get("packets_recv") or 0)
    
    packets_sec = (packets_total_curr - packets_total_prev) / time_diff
    
    errors_curr = (curr.get("err_in") or 0) + (curr.get("err_out") or 0)
    errors_prev = (prev.get("err_in") or 0) + (prev.get("err_out") or 0)
    errors_delta = errors_curr - errors_prev
    
    drops_curr = (curr.get("drop_in") or 0) + (curr.get("drop_out") or 0)
    drops_prev = (prev.get("drop_in") or 0) + (prev.get("drop_out") or 0)
    drops_delta = drops_curr - drops_prev
    
    return {
        "packets_sec": packets_sec,
        "errors": errors_delta,
        "drops": drops_delta
    }

def analyze_traffic() -> List[Dict[str, Any]]:
    """
    Analyze the latest metrics for anomalies.
    Returns a list of alerts and STORES them in DB.
    """
    alerts = []
    
    metrics = get_metrics(limit=100)
    if not metrics:
        return []

    # Group by interface
    by_interface = {}
    for m in metrics:
        if m["interface"] not in by_interface:
            by_interface[m["interface"]] = []
        by_interface[m["interface"]].append(m)
        
    for interface, records in by_interface.items():
        if len(records) < 2:
            continue
            
        curr = records[0]
        prev = records[1]
        
        rates = calculate_rate(curr, prev)
        if not rates:
            continue
            
        level = None
        
        # Check CRITICAL
        if (rates["packets_sec"] > THRESHOLDS["CRITICAL"]["packets_sec"] or 
            rates["errors"] > THRESHOLDS["CRITICAL"]["errors"] or 
            rates["drops"] > THRESHOLDS["CRITICAL"]["drops"]):
            level = "CRITICAL"
            
        # Check HIGH
        elif (rates["packets_sec"] > THRESHOLDS["HIGH"]["packets_sec"] or 
              rates["errors"] > THRESHOLDS["HIGH"]["errors"] or 
              rates["drops"] > THRESHOLDS["HIGH"]["drops"]):
            level = "HIGH"
            
        # Check MEDIUM
        elif (rates["packets_sec"] > THRESHOLDS["MEDIUM"]["packets_sec"] or 
              rates["errors"] > THRESHOLDS["MEDIUM"]["errors"] or 
              rates["drops"] > THRESHOLDS["MEDIUM"]["drops"]):
            level = "MEDIUM"
            
        if level:
            # Construct message
            msg_parts = []
            if rates["packets_sec"] > THRESHOLDS.get(level, {}).get("packets_sec", 0):
                msg_parts.append(f"Traffic {rates['packets_sec']:.0f}/s")
            if rates["errors"] > THRESHOLDS.get(level, {}).get("errors", 0):
                msg_parts.append(f"Errors {rates['errors']}")
            if rates["drops"] > THRESHOLDS.get(level, {}).get("drops", 0):
                msg_parts.append(f"Drops {rates['drops']}")
                
            message = f"{level} on {interface}: {', '.join(msg_parts)}"
            
            alert = {
                "level": level,
                "message": message,
                "timestamp": curr["timestamp"],
                "metrics_snapshot": rates
            }
            
            # Insert into DB
            try:
                alert_id = insert_alert(alert)
                alert["id"] = alert_id
            except Exception as e:
                print(f"Error inserting alert: {e}")
                
            alerts.append(alert)
            
    return alerts
