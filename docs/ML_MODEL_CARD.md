# ML Model Card: Network Anomaly Detection

## Model Details
- **Name**: Network Traffic Anomaly Detector
- **Version**: 1.0.0
- **Type**: Ensemble (Isolation Forest + Autoencoder)
- **Frameworks**: scikit-learn, TensorFlow/Keras
- **Maintainer**: Intelligent Network Analyzer Team

## Intended Use
- **Primary Use Case**: Detecting unusual network traffic patterns indicative of DDoS attacks, data exfiltration, or operational issues.
- **Inputs**: 
    - `bytes_sent`, `bytes_recv` (normalized rate)
    - `packets_per_second`
    - `error_rate_in`, `error_rate_out`
- **Outputs**:
    - `is_anomaly`: Boolean (True/False)
    - `anomaly_score`: Float (0.0 - 1.0)
    - `reconstruction_error`: Float (MSE for Autoencoder)

## Training Data
- **Source**: Local network traffic captured via `psutil`.
- **Window**: Rolling 1-hour window for baseline updates.
- **Pre-processing**:
    - Standardization (Z-score normalization).
    - Feature scaling for Autoencoder inputs.

## Performance
- **Sensitivity**: High (Optimized for recall to minimize missed threats).
- **Strategy**: Union Voting (Alert if Model A OR Model B triggers).

## Limitations
- **Cold Start**: Requires a warm-up period to gather baseline statistics.
- **False Positives**: Sudden legitimate traffic spikes (e.g., large file download) may be flagged as anomalies.
- **Scope**: Currently limited to volumetric anomalies; does not inspect packet payloads (Deep Packet Inspection).

## Ethics & Safety
- **Privacy**: The model only analyzes metadata (counters), not packet contents. No PII is processed.
- **Bias**: Training depends on the specific network environment; a model trained on a quiet home network may flag normal office traffic as anomalous.
