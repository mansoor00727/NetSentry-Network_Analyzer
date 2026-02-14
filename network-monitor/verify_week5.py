import requests
import time
import sys

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def check_endpoint(url, name):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print(f"[OK] {name}")
            return True
        else:
            print(f"[FAIL] {name} - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"[FAIL] {name} - Error: {e}")
        return False

def verify_backend():
    print("Verifying Backend...")
    check_endpoint(f"{BASE_URL}/health", "/health")
    check_endpoint(f"{BASE_URL}/metrics", "/metrics")
    check_endpoint(f"{BASE_URL}/api/analytics/summary", "/api/analytics/summary")
    check_endpoint(f"{BASE_URL}/api/analytics/models", "/api/analytics/models")

def verify_frontend():
    print("\nVerifying Frontend...")
    # Check if frontend is accessible (dev server or build preview)
    # Note: Since we built it, we might need to serve it or rely on dev server if running.
    # Assuming dev server is still running on 3000.
    check_endpoint(FRONTEND_URL, "Frontend Root")
    
    # Check for manifest
    check_endpoint(f"{FRONTEND_URL}/manifest.json", "Manifest")
    check_endpoint(f"{FRONTEND_URL}/robots.txt", "Robots.txt")

if __name__ == "__main__":
    verify_backend()
    verify_frontend()
