# Deployment Guide

This guide covers deploying the Intelligent Network Traffic Analyzer locally and to the cloud.

## Prerequisites
- Docker & Docker Compose
- Git

## Local Deployment (Docker Compose)

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/mohammadzuhaibmansoor/intelligent-network-analyzer.git
    cd intelligent-network-analyzer
    ```

2.  **Environment Setup**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    *Note: Update `INFLUXDB_ADMIN_TOKEN` and other secrets in `.env` for production.*

3.  **Build and Run**
    ```bash
    docker-compose up --build -d
    ```

4.  **Access Services**
    - **Frontend Dashboard**: `http://localhost:3000`
    - **API Docs**: `http://localhost:8000/docs`
    - **Grafana**: `http://localhost:3001` (User: `admin`, Pass: `admin`)
    - **Prometheus**: `http://localhost:9090`
    - **InfluxDB**: `http://localhost:8086`

## Cloud Deployment (AWS ECS)

### Architecture
- **ECS Fargate**: Runs containerized services (Backend, Frontend).
- **Elasticache (Redis)**: Managed Redis service.
- **Timestream (or EC2 InfluxDB)**: Time-series storage.

### Steps (Simplified)

1.  **Push Images to ECR**
    ```bash
    aws ecr create-repository --repository-name network-analyzer-backend
    docker tag network-analyzer-backend:latest <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/network-analyzer-backend:latest
    docker push <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/network-analyzer-backend:latest
    ```

2.  **Create Task Definition**
    - Define containers for Backend and Frontend.
    - Set environment variables for DB connections.

3.  **Deploy Service**
    - Create an ECS Service using the Task Definition.
    - Put a Load Balancer (ALB) in front for public access.

4.  **Security Groups**
    - Allow inbound port 80/443 to ALB.
    - Allow internal communication between containers.
