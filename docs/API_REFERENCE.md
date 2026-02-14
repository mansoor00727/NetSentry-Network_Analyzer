# API Reference

This document provides a reference for the REST API endpoints.
*(Note: For interactive documentation, run the app and visit `/docs`)*

## Authentication
(Coming in Week 5)

## Endpoints

### Health Check
- **GET** `/health`
- **Response**: `{"status": "ok"}`
- **Description**: Verifies API is running.

### Monitoring
- **GET** `/metrics`
- **Format**: Prometheus Text
- **Description**: Exposes system metrics for Prometheus scraping.

### Analytics
- **GET** `/api/analytics/summary`
    - **Query**: `days` (int, default=7)
    - **Response**: Aggregated traffic stats for the window.
- **GET** `/api/analytics/predictions`
    - **Query**: `hours` (int, default=24)
    - **Response**: Forecasted traffic volume.
- **GET** `/api/analytics/models`
    - **Response**: Status of ML models (active/inactive, version).
- **POST** `/api/analytics/anomaly-explain`
    - **Body**: `{"features": {...}}`
    - **Response**: SHAP values explaining anomaly contribution.

### WebSocket
- **ws** `/ws`
- **Description**: Real-time stream of:
    - `sys_info`: CPU/RAM usage.
    - `net_io`: Network bytes sent/recv.
    - `ml_analysis`: Anomaly scores.

## Error Codes
- `404`: Resource not found.
- `500`: Internal server error.
