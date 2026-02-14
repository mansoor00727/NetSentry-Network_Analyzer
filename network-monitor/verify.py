import time
import requests

BASE_URL = "http://localhost:8000"

def test_stats():
    print("Testing /api/stats...")
    # Wait for monitor to run at least once
    time.sleep(5) 
    try:
        resp = requests.get(f"{BASE_URL}/api/stats")
        if resp.status_code == 200:
            data = resp.json()
            # Expect list of records from InfluxDB
            if isinstance(data, list):
                print(f"Stats received: {len(data)} records")
                if len(data) > 0:
                    print(f"Sample: {data[0]}")
            elif isinstance(data, dict):
                 print(f"Stats received: {data.keys()}")
            else:
                 print(f"Unknown stats format: {type(data)}")
        else:
            print(f"Failed to fetch stats: {resp.status_code}")
    except Exception as e:
        print(f"Stats test failed: {e}")

def test_alerts():
    print("Testing /api/alerts...")
    try:
        response = requests.get(f"{BASE_URL}/api/alerts")
        if response.status_code == 200:
            alerts = response.json()
            print(f"Alerts received: {len(alerts)}")
        else:
            print(f"Failed to fetch alerts: {response.status_code}")
    except Exception as e:
        print(f"Alerts test failed: {e}")

if __name__ == "__main__":
    print("Waiting for services...")
    time.sleep(5) 
    test_stats()
    test_alerts()
