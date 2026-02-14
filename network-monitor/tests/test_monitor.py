import pytest
import time
import threading
from unittest.mock import MagicMock, patch
from src.monitor import collect_metrics, monitor_loop, start_monitor

def test_collect_metrics():
    """Test that metrics are collected correctly from psutil."""
    # Mock psutil.net_io_counters
    mock_io = MagicMock()
    mock_io.bytes_sent = 1000
    mock_io.bytes_recv = 2000
    mock_io.packets_sent = 10
    mock_io.packets_recv = 20
    mock_io.errin = 0
    mock_io.errout = 0
    mock_io.dropin = 0
    mock_io.dropout = 0
    
    with patch('psutil.net_io_counters', return_value={'eth0': mock_io}):
        metrics = collect_metrics()
        
        assert len(metrics) == 1
        assert metrics[0]['interface'] == 'eth0'
        assert metrics[0]['bytes_sent'] == 1000
        assert metrics[0]['bytes_recv'] == 2000

@patch('src.monitor.insert_metric')
@patch('src.monitor.collect_metrics')
def test_monitor_loop(mock_collect, mock_insert):
    """Test the monitor loop logic."""
    stop_event = threading.Event()
    
    # Mock return value
    mock_collect.return_value = [{'interface': 'eth0', 'bytes_sent': 100}]
    
    # Run loop in a separate thread to avoid blocking, 
    # but for testing logic we can just run one iteration or mock sleep
    
    with patch('time.sleep', side_effect=lambda x: stop_event.set()):
        monitor_loop(interval=0.1, stop_event=stop_event)
        
    assert mock_collect.called
    assert mock_insert.called
    mock_insert.assert_called_with({'interface': 'eth0', 'bytes_sent': 100})

def test_start_monitor():
    """Test starting the background thread."""
    with patch('src.monitor.monitor_loop') as mock_loop:
        stop_event = start_monitor(interval=1)
        assert isinstance(stop_event, threading.Event)
        # We can't easily assert the thread started without joining, 
        # but we can check if the function returns the event.
        stop_event.set()
