# Intelligent Network Traffic Analyzer (NetSentry)

A real-time network monitoring and anomaly detection system that leverages Machine Learning to identify potential security threats.

![Dashboard Preview](docs/dashboard-preview.png)

> **[🔴 View Live Demo](https://storage.googleapis.com/intelligent-network-website/index.html)** (Login: `admin` / `admin`)

## 🚀 Key Features

- **Real-Time Monitoring**: Live visualization of network traffic (Bytes/sec, Packets/sec).
- **ML-Powered Anomaly Detection**: Uses Isolation Forest and Autoencoder models to detect unusual traffic patterns (e.g., DDOS, intrusion attempts).
- **Interactive Dashboard**: Built with Next.js and Recharts, offering historical analytics (24h, 7d, 30d) and instant alerts.
- **Microservices Architecture**: Containerized with Docker, featuring a FastAPI backend and InfluxDB for time-series data storage.
- **Cloud Ready**: Deploys seamlessly to Google Cloud Run (Backend) and Google Cloud Storage (Frontend).

## 📚 Documentation

For a detailed guide on architecture, data flow, and operation, please refer to the [Project Handbook](docs/handbook.md).

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Zustand, Recharts, Framer Motion
- **Backend**: FastAPI, Python 3.10+, Scikit-learn
- **Database**: InfluxDB (Time-series), Redis (Caching)
- **DevOps**: Docker, Docker Compose

## 🏁 Quick Start

### Prerequisites
- Docker & Docker Compose

### Running the Application

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/mansoor00727/intelligent-network-traffic-analyzer.git
    cd intelligent-network-traffic-analyzer
    ```

2.  **Start via Docker Compose**:
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the Dashboard**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

    *Default Admin Credentials*:
    *   Username: `admin`
    *   Password: `password`

### Development Mode

For active development, you can run the services individually:

1.  Start infrastructure (DBs): `docker-compose up -d influxdb redis`
2.  Start Backend: `cd network-monitor && uvicorn src.api:app --reload`
3.  Start Frontend: `cd intelligent-network-website && npm run dev`

## 🧪 Simulation & Testing

To test the ML alerts, use the included traffic simulation tool:

```bash
cd network-monitor
python3 simulate_traffic.py
```
This script acts as a traffic generator to simulate normal load, spikes, and anomalies.

## 🤝 Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
