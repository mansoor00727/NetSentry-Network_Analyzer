import requests
import time
import random
import threading
import sys

URL = "http://localhost:8000/health"
API_URL = "http://localhost:8000/api/token"

def send_burst(duration_sec=10, rate_per_sec=50):
    print(f"Starting traffic burst: {rate_per_sec} req/s for {duration_sec}s...")
    end_time = time.time() + duration_sec
    count = 0
    
    while time.time() < end_time:
        try:
            # Mix of requests
            if random.random() < 0.1:
                # Login attempt (POST)
                requests.post(API_URL, data={"username": "fake", "password": "fake"})
            else:
                # Health check (GET)
                requests.get(URL)
            count += 1
            time.sleep(1.0/rate_per_sec)
        except Exception as e:
            print(f"Error: {e}")
            
    print(f"Burst complete. Sent {count} requests.")

def main():
    print("=== Network Traffic Simulator ===")
    print("This script generates HTTP traffic to the local backend to simulate activity.")
    print("1. Normal Traffic (10 req/s)")
    print("2. High Traffic Spike (100 req/s)")
    print("3. DDOS / Anomaly Simulation (500 req/s)")
    print("4. Exit")
    
    while True:
        choice = input("\nSelect mode (1-4): ")
        
        if choice == '1':
            send_burst(10, 10)
        elif choice == '2':
            send_burst(10, 100)
        elif choice == '3':
            print("WARNING: This might create significant load.")
            send_burst(15, 500)
        elif choice == '4':
            break
        else:
            print("Invalid choice")

if __name__ == "__main__":
    main()
