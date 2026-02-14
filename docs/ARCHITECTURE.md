# Intelligent Network Traffic Analyzer - Architecture

This document describes the high-level architecture of the Intelligent Network Traffic Analyzer. The system is designed for real-time traffic monitoring, anomaly detection using ML, and retrospective analysis.

## System Overview

The application follows a microservices-inspired architecture, containerized with Docker.

```mermaid
graph TD
    subgraph Client Layer
        Browser[Web Dashboard (React)]
        Grafana[Grafana Dashboards]
    end

    subgraph Application Layer
        API[FastAPI Backend]
        Monitor[Network Monitor Service]
        ML[ML Anomaly Detector]
        Scheduler[APScheduler]
    end

    subgraph Data Layer
        InfluxDB[(InfluxDB v2)]
        Redis[(Redis Cache)]
        Prometheus[Prometheus]
    end

    %% Data Flow
    Monitor -->|Raw Packets| ML
    Monitor -->|Metrics| InfluxDB
    Monitor -->|Real-time Stats| API
    
    ML -->|Anomaly Scores| Monitor
    ML -->|Model Metadata| Redis
    
    API <-->|WebSocket| Browser
    API <-->|Flux Queries| InfluxDB
    API <-->|Cache| Redis
    
    Scheduler -->|Retrain Trigger| ML
    
    Prometheus -->|Scrape /metrics| API
    Grafana -->|Query| Prometheus
    Grafana -->|Query| InfluxDB
```

## Component Details

### 1. Network Monitor (`src/monitor.py`)
- Captures network packet statistics using `psutil`.
- Aggregates data into 1-second windows.
- Pushes metrics to InfluxDB and broadcasts via WebSocket.

### 2. ML Engine (`src/ml/`)
- **Isolation Forest**: Unsupervised anomaly detection for outlier traffic.
- **Autoencoder**: Deep learning model for reconstructing normal traffic patterns (high reconstruction error = anomaly).
- **Ensemble**: Union voting strategy (OR logic) for maximum sensitivity.

### 3. API (`src/api.py`)
- FastAPI application serving REST endpoints and WebSockets.
- Exposes Prometheus metrics at `/metrics`.
- Provides analytics endpoints (`/api/analytics/*`) for frontend visualization.

### 4. Storage
- **InfluxDB**: Time-series database for high-volume metric storage (1-second resolution).
- **Redis**: Caching layer for expensive aggregation queries and model metadata.

### 5. Monitoring
- **Prometheus**: Scrapes application metrics for alerting and operational monitoring.
- **Grafana**: Visualizes system health and long-term trends.
