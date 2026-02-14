import time
import psutil
import requests
import argparse
import logging
import sys
from datetime import datetime, timezone

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("NetSentry-Probe")

def collect_metrics():
    """Collect network metrics using psutil."""
    metrics = []
    try:
        # Get IO counters for each interface
        net_io = psutil.net_io_counters(pernic=True)
        timestamp = datetime.now(timezone.utc).isoformat()
        
        for interface, stats in net_io.items():
            # Skip loopback and inactive
            if stats.bytes_sent == 0 and stats.bytes_recv == 0:
                continue
                
            metric = {
                "interface": interface,
                "bytes_sent": stats.bytes_sent,
                "bytes_recv": stats.bytes_recv,
                "packets_sent": stats.packets_sent,
                "packets_recv": stats.packets_recv,
                "err_in": stats.errin,
                "err_out": stats.errout,
                "drop_in": stats.dropin,
                "drop_out": stats.dropout,
                "timestamp": timestamp
            }
            metrics.append(metric)
    except Exception as e:
        logger.error(f"Error collecting metrics: {e}")
        
    return metrics

def send_metrics(url, api_key, metrics):
    """Send metrics to the backend."""
    if not metrics:
        return
        
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    payload = {"metrics": metrics}
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        if response.status_code == 201:
            logger.info(f"Successfully sent {len(metrics)} metrics to {url}")
        else:
            logger.error(f"Failed to send metrics. Status: {response.status_code}, Response: {response.text}")
    except Exception as e:
        logger.error(f"Connection error: {e}")

def main():
    parser = argparse.ArgumentParser(description="NetSentry Network Probe")
    parser.add_argument("--url", default="http://localhost:8000/api/v1/ingest", help="Backend Ingestion URL")
    parser.add_argument("--key", required=True, help="API Key for authentication")
    parser.add_argument("--interval", type=int, default=5, help="Reporting interval in seconds")
    
    args = parser.parse_args()
    
    logger.info(f"Starting NetSentry Probe...")
    logger.info(f"Target: {args.url}")
    logger.info(f"Interval: {args.interval}s")
    
    try:
        while True:
            metrics = collect_metrics()
            send_metrics(args.url, args.key, metrics)
            time.sleep(args.interval)
    except KeyboardInterrupt:
        logger.info("Probe stopped by user.")
        sys.exit(0)

if __name__ == "__main__":
    main()
