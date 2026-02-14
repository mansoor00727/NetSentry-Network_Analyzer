from fastapi.testclient import TestClient
from src.api import app
import pytest
from unittest.mock import patch, MagicMock

client = TestClient(app)

@patch("src.api.get_metrics")
def test_get_stats(mock_get_metrics):
    """Test /api/stats endpoint."""
    mock_data = [{"interface": "eth0", "bytes_sent": 100}]
    mock_get_metrics.return_value = mock_data
    
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["current"] == mock_data[0]
    assert len(data["history"]) == 1

@patch("src.api.analyze_traffic")
def test_get_alerts(mock_analyze):
    """Test /api/alerts endpoint."""
    mock_alerts = [{"level": "HIGH", "message": "Test Alert"}]
    mock_analyze.return_value = mock_alerts
    
    response = client.get("/api/alerts")
    assert response.status_code == 200
    assert response.json() == mock_alerts
