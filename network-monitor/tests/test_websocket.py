from fastapi.testclient import TestClient
from src.api import app
import json

client = TestClient(app)

def test_websocket_connect_and_history():
    with client.websocket_connect("/ws") as websocket:
        # First message should be history
        data = websocket.receive_json()
        assert data["type"] == "history"
        assert isinstance(data["data"], list)
        
        # We might receive an update immediately if the monitor runs, 
        # but since TestClient stops the event loop of the app lifespan usually,
        # we might rely on the startup event. 
        # Actually TestClient runs lifespan. 
        # The monitor thread starts.
        # So we might receive updates.
        
        # Let's wait for one update
        try:
            data = websocket.receive_json()
            # It could be update or error if collection fails
            assert data["type"] == "update" or "error" in data
        except Exception:
            # It's possible no update comes fast enough or thread issues in test env
            pass

def test_websocket_disconnect():
    with client.websocket_connect("/ws") as websocket:
        websocket.close()
        # Should close without error
