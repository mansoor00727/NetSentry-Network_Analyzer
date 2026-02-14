import datetime
from typing import List, Dict, Any, Optional
from influxdb_client import Point
from src.config.influxdb_config import (
    get_write_api, 
    get_query_api, 
    INFLUX_BUCKET, 
    INFLUX_BUCKET_ALERTS, 
    INFLUX_ORG
)

# No init_db needed as buckets are created via script/docker

def insert_metric(data: Dict[str, Any], device_id: str = "local") -> None:
    """
    Write a network metric record to InfluxDB.
    Measurement: interface_stats
    Tags: interface, host
    Fields: bytes_sent, bytes_recv, ...
    """
    write_api = get_write_api()
    
    # Ensure timestamp
    timestamp = data.get("timestamp")
    if not timestamp:
         timestamp = datetime.datetime.now(datetime.timezone.utc)
    
    point = Point("interface_stats") \
        .tag("interface", data["interface"]) \
        .tag("device_id", device_id) \
        .tag("host", "localhost") \
        .field("bytes_sent", int(data["bytes_sent"])) \
        .field("bytes_recv", int(data["bytes_recv"])) \
        .field("packets_sent", int(data["packets_sent"])) \
        .field("packets_recv", int(data["packets_recv"])) \
        .field("err_in", int(data["err_in"])) \
        .field("err_out", int(data["err_out"])) \
        .field("drop_in", int(data["drop_in"])) \
        .field("drop_out", int(data["drop_out"])) \
        .time(timestamp)
        
    write_api.write(bucket=INFLUX_BUCKET, org=INFLUX_ORG, record=point)

def insert_alert(alert: Dict[str, Any], device_id: str = "local") -> None:
    """
    Write an alert to InfluxDB.
    Measurement: alerts
    Tags: level, interface
    Fields: message, metrics_json (string)
    """
    write_api = get_write_api()
    
    timestamp = alert.get("timestamp")
    if not timestamp:
         timestamp = datetime.datetime.now(datetime.timezone.utc)
    
    # Extract interface from message or passed in alert? 
    # Current analyzer passes 'level', 'message', 'timestamp', 'metrics_snapshot'.
    # We should parse interface if not explicit.
    # For now, let's just use 'unknown' if not in alert dict, 
    # but analyzer constructs message like "High traffic on {interface}..."
    interface = alert.get("interface", "unknown")
    
    import json
    metrics_json = json.dumps(alert.get("metrics_snapshot", {}))
    
    point = Point("alerts") \
        .tag("level", alert["level"]) \
        .tag("interface", interface) \
        .tag("device_id", device_id) \
        .field("message", alert["message"]) \
        .field("metrics_json", metrics_json) \
        .time(timestamp)
        
    write_api.write(bucket=INFLUX_BUCKET_ALERTS, org=INFLUX_ORG, record=point)

def get_metrics(limit: int = 60, device_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieve the latest network metrics from InfluxDB.
    Returns list of dicts similar to SQLite format.
    """
    query_api = get_query_api()
    
    # Flux query to get recent data
    # range: -limit*1s (approx) or just last few minutes
    # We need to pivot functionality to get fields as columns
    query = f'''
    from(bucket: "{INFLUX_BUCKET}")
      |> range(start: -5m)
      |> filter(fn: (r) => r["_measurement"] == "interface_stats")
    '''
    
    if device_id:
        query += f'  |> filter(fn: (r) => r["device_id"] == "{device_id}")\n'
        
    query += '''
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> group(columns: ["interface"])
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: {limit})
    '''
    
    tables = query_api.query(query, org=INFLUX_ORG)
    
    results = []
    for table in tables:
        for record in table.records:
            results.append(record.values)
            
    # Normalize keys to match old SQLite format if needed
    normalized = []
    for r in results:
        d = r.copy()
        # Convert _time to timestamp string
        if "_time" in d:
            d["timestamp"] = d["_time"].isoformat()
            
        # Remove internal InfluxDB fields that are datetime objects or irrelevant
        for key in ["_time", "_start", "_stop", "_measurement", "result", "table"]:
            d.pop(key, None)
            
        normalized.append(d)
        
    return normalized

def get_alerts(level: str = None, limit: int = 50, device_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve alerts from InfluxDB."""
    query_api = get_query_api()
    
    query = f'''
    from(bucket: "{INFLUX_BUCKET_ALERTS}")
      |> range(start: -24h)
      |> filter(fn: (r) => r["_measurement"] == "alerts")
    '''
    
    if device_id:
        query += f' |> filter(fn: (r) => r["device_id"] == "{device_id}")'
    
    if level:
         query += f' |> filter(fn: (r) => r["level"] == "{level}")'
         
    query += f'''
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: {limit})
    '''
    
    tables = query_api.query(query, org=INFLUX_ORG)
    
    results = []
    for table in tables:
        for record in table.records:
            d = record.values
            d["timestamp"] = d["_time"].isoformat()
            if "metrics_json" in d:
                import json
                try:
                    d["metrics_json"] = json.loads(d["metrics_json"])
                except:
                    pass
            results.append(d)
            
    return results

# Keep these available for imports but they are now wrapper functions or removed
def init_db():
    pass

def get_aggregated_metrics(start_time: datetime.datetime, device_id: Optional[str] = None) -> Dict[str, float]:
    """
    Aggregate metrics from start_time to now.
    Returns dictionary with total_bytes_sent, total_bytes_recv, error_ratio.
    """
    query_api = get_query_api()
    
    # Calculate totals
    # We want sum of bytes_sent etc.
    # Note: InfluxDB accumulators might reset if container restarts? 
    # psutil counters are cumulative since boot. 
    # If we are storing raw counters, we should take max(value) - min(value) over the period?
    # OR if we are storing rate/diffs? 
    # monitor.py stores RAW counters from psutil.
    # So to get total bytes transferred in a period = max(bytes) - min(bytes).
    # However, if container restarted, counters reset to 0. 
    # Handling reset counters in Influx: difference() or derivative()?
    # Simpler approach for now: 
    #   If we assume counters are monotonic increasing (mostly), spread() gives diff between max and min.
    #   But if reset happens, max-min is wrong.
    #   Correct way: aggregate the non-negative differences between points.
    
    # Let's try to get the spread for now, acknowledging reset limitation.
    
    query = f'''
    from(bucket: "{INFLUX_BUCKET}")
      |> range(start: {start_time.isoformat()})
      |> filter(fn: (r) => r["_measurement"] == "interface_stats")
    '''
    
    if device_id:
        query += f'  |> filter(fn: (r) => r["device_id"] == "{device_id}")\n'

    query += '''
      |> filter(fn: (r) => r["_field"] == "bytes_sent" or r["_field"] == "bytes_recv" or r["_field"] == "err_in" or r["_field"] == "err_out" or r["_field"] == "packets_sent" or r["_field"] == "packets_recv")
      |> spread()
      |> group(columns: ["_field"])
      |> sum()
    '''
    
    tables = query_api.query(query, org=INFLUX_ORG)
    
    results = {
        "bytes_sent": 0.0,
        "bytes_recv": 0.0,
        "err_in": 0.0,
        "err_out": 0.0,
        "packets_sent": 0.0,
        "packets_recv": 0.0
    }
    
    for table in tables:
        for record in table.records:
            field = record.get_field()
            value = record.get_value()
            if field in results:
                results[field] = float(value)
                
    total_packets = results["packets_sent"] + results["packets_recv"]
    total_errors = results["err_in"] + results["err_out"]
    
    error_ratio = 0.0
    if total_packets > 0:
        error_ratio = total_errors / total_packets
        
    results["error_ratio"] = error_ratio
    
    return results

def get_timeseries_metrics(start_time: datetime.datetime, window: str = "1h", device_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Get aggregated metrics over time for charting.
    window: aggregation window (e.g., '1h', '1d').
    """
    query_api = get_query_api()
    
    # We want series of bytes_sent/recv over time
    query = f'''
    from(bucket: "{INFLUX_BUCKET}")
      |> range(start: {start_time.isoformat()})
      |> filter(fn: (r) => r["_measurement"] == "interface_stats")
      |> filter(fn: (r) => r["_field"] == "bytes_sent" or r["_field"] == "bytes_recv")
      |> aggregateWindow(every: {window}, fn: max, createEmpty: false)
      |> difference(nonNegative: true) 
      |> group(columns: ["_time"])
      |> sum()
      |> group(columns: ["_field"])
    '''
    # Note: difference() is good if counters are increasing. 
    # But if we just use spread/diff on raw counters it's tricky with resets.
    # aggregateWindow(fn: spread) might be better?
    # Or derivative?
    
    # Simpler: use spread() in window.
    query = f'''
    from(bucket: "{INFLUX_BUCKET}")
      |> range(start: {start_time.isoformat()})
      |> filter(fn: (r) => r["_measurement"] == "interface_stats")
    '''
    
    if device_id:
        query += f'  |> filter(fn: (r) => r["device_id"] == "{device_id}")\n'

    query += '''
      |> filter(fn: (r) => r["_field"] == "bytes_sent" or r["_field"] == "bytes_recv")
      |> aggregateWindow(every: {window}, fn: spread, createEmpty: true)
      |> yield(name: "formatted")
    '''
    
    tables = query_api.query(query, org=INFLUX_ORG)
    
    # Organize into time points
    # Timestamp -> {sent: x, recv: y}
    data_map = {}
    
    for table in tables:
        for record in table.records:
            time_str = record.get_time().isoformat()
            field = record.get_field()
            value = record.get_value() or 0
            
            if time_str not in data_map:
                data_map[time_str] = {"timestamp": time_str, "bytes_sent": 0, "bytes_recv": 0}
            
            if field == "bytes_sent":
                data_map[time_str]["bytes_sent"] += value
            elif field == "bytes_recv":
                data_map[time_str]["bytes_recv"] += value
                
    # Sort by time
    results = sorted(data_map.values(), key=lambda x: x["timestamp"])
    return results
