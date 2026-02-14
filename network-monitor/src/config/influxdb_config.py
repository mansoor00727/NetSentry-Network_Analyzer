import os
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS

# Configuration
INFLUX_URL = os.getenv("INFLUX_URL", "http://localhost:8086")
INFLUX_TOKEN = os.getenv("INFLUX_TOKEN", "my-super-secret-auth-token")
INFLUX_ORG = os.getenv("INFLUX_ORG", "network-analyzer")
INFLUX_BUCKET = os.getenv("INFLUX_BUCKET", "network_metrics")
INFLUX_BUCKET_ALERTS = os.getenv("INFLUX_BUCKET_ALERTS", "alerts")

_client = None

def get_influx_client():
    """Get or create a singleton InfluxDB client."""
    global _client
    if _client is None:
        _client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
    return _client

def get_write_api():
    """Get asynchronous write API."""
    client = get_influx_client()
    return client.write_api(write_options=ASYNCHRONOUS)

def get_query_api():
    """Get query API."""
    client = get_influx_client()
    return client.query_api()

def close_client():
    """Close the InfluxDB client."""
    global _client
    if _client:
        _client.close()
        _client = None
