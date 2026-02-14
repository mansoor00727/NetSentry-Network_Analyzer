import numpy as np
import pandas as pd
from typing import Dict, Any, List

def calculate_features(metrics_history: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Transform raw metrics history into ML-ready features.
    
    metrics_history: List of dicts, each containing:
        - timestamp (ISO string)
        - bytes_sent, bytes_recv
        - packets_sent, packets_recv
        - err_in, err_out, drop_in, drop_out
    
    Returns: DataFrame with features
    """
    if not metrics_history:
        return pd.DataFrame()
        
    df = pd.DataFrame(metrics_history)
    
    # Convert timestamp to datetime
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
    
    # Calculate rates (diff / time_diff)
    # Ensure we handle multiple interfaces separately or aggregate?
    # For anomaly detection, we might want per-interface features.
    # But usually we train on specific interface behavior.
    # Let's assume this DF is for a SINGLE interface or aggregated.
    # User requirement: "bytes_sent_per_sec (rate of change)"
    
    # We need to calculate differences between rows
    # If the input is a list of snapshots (cumulative counters), we do diff().
    # If the input is already rates (from some pre-processing), we skip.
    # psutil returns cumulative counters.
    
    # Drop non-numeric for calculation
    numeric_cols = [
        'bytes_sent', 'bytes_recv', 
        'packets_sent', 'packets_recv',
        'err_in', 'err_out', 
        'drop_in', 'drop_out'
    ]
    
    # Filter only existing numeric columns
    numeric_cols = [c for c in numeric_cols if c in df.columns]
    
    if not numeric_cols:
        return pd.DataFrame()

    # Calculate diff
    # We assume the list is sorted by time and consecutive (per collection interval)
    df_diff = df[numeric_cols].diff()
    
    # Time diff in seconds
    if 'timestamp' in df.columns:
        time_diff = df['timestamp'].diff().dt.total_seconds()
        # Handle zero time diff to avoid division by zero
        time_diff = time_diff.replace(0, np.nan) 
    else:
        # Assume generic 1s interval if not present?
        time_diff = 1.0
        
    # Calculate rates
    features = pd.DataFrame()
    
    features['bytes_sent_sec'] = df_diff['bytes_sent'] / time_diff
    features['bytes_recv_sec'] = df_diff['bytes_recv'] / time_diff
    features['packets_sec'] = (df_diff['packets_sent'] + df_diff['packets_recv']) / time_diff
    
    # Ratios (avoid division by zero)
    total_packets = df_diff['packets_sent'] + df_diff['packets_recv']
    total_packets = total_packets.replace(0, np.nan)
    
    total_errors = df_diff['err_in'] + df_diff['err_out']
    features['error_ratio'] = total_errors / total_packets
    
    total_drops = df_diff['drop_in'] + df_diff['drop_out']
    features['drop_ratio'] = total_drops / total_packets
    
    # Packet size avg
    total_bytes = df_diff['bytes_sent'] + df_diff['bytes_recv']
    features['packet_size_avg'] = total_bytes / total_packets
    
    # Traffic direction ratio (sent / recv)
    # metrics might be 0, so handle nan/inf
    features['traffic_direction_ratio'] = df_diff['bytes_sent'] / df_diff['bytes_recv'].replace(0, np.nan)
    
    # Fill NAs (first row will be NA due to diff)
    features = features.fillna(0)
    
    # Replace inf with 0 or max value
    features = features.replace([np.inf, -np.inf], 0)
    
    return features

def prepare_single_record(curr: Dict[str, Any], prev: Dict[str, Any]) -> pd.DataFrame:
    """Helper to calculate features for a single point in real-time prediction."""
    # Create a micro-dataframe of 2 rows
    history = [prev, curr]
    features = calculate_features(history)
    # Return only the last row (current features)
    return features.iloc[[-1]]
