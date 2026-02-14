import pytest
import datetime
from src.analyzer import analyze_traffic, calculate_rate

def test_calculate_rate():
    """Test rate calculation logic."""
    prev = {
        "timestamp": "2023-01-01T12:00:00",
        "packets_sent": 1000,
        "packets_recv": 1000,
        "err_in": 0, "err_out": 0,
        "drop_in": 0, "drop_out": 0
    }
    curr = {
        "timestamp": "2023-01-01T12:00:05",
        "packets_sent": 6000, # +5000
        "packets_recv": 6000, # +5000 -> Total delta 10000
        "err_in": 50, "err_out": 51, # Total 101
        "drop_in": 25, "drop_out": 26 # Total 51
    }
    
    rates = calculate_rate(curr, prev)
    
    # 10000 packets / 5 sec = 2000 pkts/sec (Wait, packets_total > 5000/sec HIGH)
    assert rates["packets_sec"] == 2000.0
    assert rates["errors"] == 101
    assert rates["drops"] == 51

@pytest.fixture
def mock_get_metrics(monkeypatch):
    def mock_return(limit=100):
        # Return 2 records for eth0
        return [
            {
                "timestamp": "2023-01-01T12:00:05",
                "interface": "eth0",
                "packets_sent": 26000, # Delta 25000+packets_recv...
                "packets_recv": 0,
                "err_in": 0, "err_out": 0,
                "drop_in": 0, "drop_out": 0
            },
            {
                "timestamp": "2023-01-01T12:00:00",
                "interface": "eth0",
                "packets_sent": 0,
                "packets_recv": 0,
                "err_in": 0, "err_out": 0,
                "drop_in": 0, "drop_out": 0
            }
        ]
    monkeypatch.setattr("src.analyzer.get_metrics", mock_return)

def test_analyze_traffic(mock_get_metrics):
    """Test full analysis flow."""
    alerts = analyze_traffic()
    assert len(alerts) == 1
    assert alerts[0]["level"] == "HIGH"
    assert "High traffic on eth0" in alerts[0]["message"]
