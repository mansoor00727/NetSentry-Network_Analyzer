import pytest
import sqlite3
import os
from pathlib import Path
from src.database import init_db, insert_metric, get_metrics

TEST_DB = Path("test_network.db")

@pytest.fixture
def db():
    """Fixture to set up and tear down a test database."""
    if TEST_DB.exists():
        os.remove(TEST_DB)
    init_db(TEST_DB)
    yield TEST_DB
    if TEST_DB.exists():
        os.remove(TEST_DB)

def test_init_db(db):
    """Test that the database is initialized correctly."""
    assert db.exists()
    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='metrics';")
    assert cursor.fetchone() is not None
    conn.close()

def test_insert_and_get_metrics(db):
    """Test inserting and retrieving metrics."""
    data = {
        "interface": "eth0",
        "bytes_sent": 100,
        "bytes_recv": 200,
        "packets_sent": 10,
        "packets_recv": 20,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
    }
    insert_metric(data, db)
    
    metrics = get_metrics(limit=1, db_path=db)
    assert len(metrics) == 1
    assert metrics[0]["interface"] == "eth0"
    assert metrics[0]["bytes_sent"] == 100
