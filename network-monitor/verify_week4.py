import requests
import sys
import time
import json

BASE_URL = "http://localhost:8000"

def check_endpoint(url, description):
    print(f"Testing {description} ({url})...", end=" ")
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print("OK")
            return response
        else:
            print(f"FAILED (Status: {response.status_code})")
            print(response.text[:200])
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def verify_prometheus():
    print("\n--- Verifying Prometheus Metrics ---")
    response = check_endpoint(f"{BASE_URL}/metrics", "/metrics")
    if response:
        content = response.text
        if "network_bytes_sent_total" in content:
            print("  Found 'network_bytes_sent_total' metric.")
        else:
            print("  MISSING 'network_bytes_sent_total' metric.")
            
        if "network_anomaly_score" in content:
            print("  Found 'network_anomaly_score' metric.")
        else:
            print("  MISSING 'network_anomaly_score' metric. (Maybe no anomaly yet)")

def verify_analytics():
    print("\n--- Verifying Analytics API ---")
    
    # Summary
    resp = check_endpoint(f"{BASE_URL}/api/analytics/summary?days=7", "/api/analytics/summary")
    if resp:
        data = resp.json()
        if "metrics" in data:
            print("  Summary data structure valid.")
        else:
            print(f"  Invalid summary response: {data}")

    # Predictions
    resp = check_endpoint(f"{BASE_URL}/api/analytics/predictions?hours=24", "/api/analytics/predictions")
    if resp:
        data = resp.json()
        if "predictions" in data:
            print("  Predictions data structure valid.")
        else:
             print(f"  Invalid predictions response: {data}")
            
    # Correlation (not implemented yet? check requirements)
    # I didn't implement correlation yet. 
    pass

def verify_ml_models():
    print("\n--- Verifying ML Models API ---")
    resp = check_endpoint(f"{BASE_URL}/api/analytics/models", "/api/analytics/models")
    if resp:
        data = resp.json()
        if "models" in data and "isolation_forest" in data["models"]:
            print("  ML Models data structure valid.")
        else:
             print(f"  Invalid ML models response: {data}")

def verify_health():
    print("\n--- Verifying Health ---")
    check_endpoint(f"{BASE_URL}/health", "/health")

if __name__ == "__main__":
    print("Waiting for services to be ready...")
    time.sleep(5) 
    verify_health()
    verify_prometheus()
    verify_analytics()
    verify_ml_models()
