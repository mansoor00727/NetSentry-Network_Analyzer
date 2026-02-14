# Week 4: ML Anomaly Detection & Monitoring

## Overview
Week 4 focused on adding intelligence and robust monitoring to the Network Analyzer. We introduced Machine Learning models for anomaly detection and integrated industry-standard monitoring tools (Prometheus & Grafana).

## Architecture Updates
### 1. ML Anomaly Detection
- **Models**:
    - **Isolation Forest**: Unsupervised learning for detecting outliers in high-dimensional space.
    - **Autoencoder**: Neural network that learns to reconstruct normal traffic patterns; significant reconstruction error indicates anomaly.
- **Ensemble Strategy**: Both models run in parallel. An alert is triggered if either model detects an anomaly (Union strategy for high sensitivity).
- **Feature Engineering**: Raw metrics are transformed into rates (bytes/sec, packets/sec), ratios (error rate, drop rate), and directionality features.
- **Registry**: Models are version-controlled in `network-monitor/models/`.

### 2. Monitoring Stack
- **Prometheus**: Scrapes `/metrics` from the backend every 5 seconds. Stores time-series data for operational monitoring.
- **Grafana**: Visualizes Prometheus metrics. Pre-configured with a "Network Traffic" dashboard.
- **Exporters**: Backend now exposes standard Prometheus metrics:
    - `network_bytes_sent_total` (Gauge/Counter)
    - `network_bytes_recv_total` (Gauge/Counter)
    - `network_anomaly_score` (Gauge)

### 3. Advanced Analytics API
- `/api/analytics/summary`: Aggregated stats over time windows.
- `/api/analytics/predictions`: Future traffic forecasting (placeholder for ARIMA/Prophet).
- `/api/analytics/anomaly-explain`: Explains *why* an anomaly was flagged.

### 4. Background Scheduling
- **APScheduler** handles periodic tasks:
    - `retrain_models`: Runs daily to retrain ML models on the latest data.
    - `update_baseline`: Hourly statistical baseline updates.

## Verification
### Metrics
- Endpoint: `http://localhost:8000/metrics`
- Scraped by Promethes: `http://localhost:9090`

### Dashboards
- Grafana: `http://localhost:3001` (admin/admin)
- Dashboard: "Intelligent Network Analyzer"

### Tests
- `verify_week4.py`: Automated check of API endpoints.
