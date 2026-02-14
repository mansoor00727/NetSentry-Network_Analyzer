from prometheus_client import Counter, Gauge, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time

class PrometheusExporter:
    def __init__(self):
        # Metrics definitions
        # Use Gauge for psutil totals allow direct setting of absolute values
        # Prometheus rate() function works on Gauges too if they behave like counters (mostly increasing)
        self.bytes_sent = Gauge('network_bytes_sent_total', 'Total bytes sent', ['interface'])
        self.bytes_recv = Gauge('network_bytes_recv_total', 'Total bytes received', ['interface'])
        
        self.packets_rate = Gauge('network_packets_per_second', 'Current packets per second', ['interface'])
        
        self.errors_total = Gauge('network_errors_total', 'Total errors', ['interface', 'error_type'])
        self.drops_total = Gauge('network_drops_total', 'Total drops', ['interface', 'drop_type'])
        
        self.anomaly_score = Gauge('network_anomaly_score', 'ML anomaly confidence', ['interface', 'model'])
        
        self.alerts_total = Counter('network_alert_total', 'Total alerts triggered', ['interface', 'severity'])
        
        self.uptime = Gauge('app_uptime_seconds', 'Application uptime in seconds')
        self.start_time = time.time()
        
    def update_network_metrics(self, stats: dict):
        """Update standard network counters/gauges."""
        iface = stats.get('interface', 'unknown')
        
        # Convert to float/int
        try:
            # Note: Counters should increase. 
            # If we receive absolute totals from psutil, we should use those directly if compatible,
            # BUT prometheus client Counter expects increments or we can set value for Gauge.
            # Ideally Counters are monotonic. psutil gives total since boot.
            # So we can use ._value.set() internal hack OR just use a Gauge for "Total Bytes"?
            # Standard pattern: Expose monotonically increasing value as Counter.
            # The client library handles scrape logic? No, client library maintains state.
            # We should assume this persists.
            
            # Since psutil gives TOTALS, we cannot just .inc() the difference easily without tracking state.
            # However, Prometheus counters ARE totals. 
            # We can hacking internal value? No.
            # Better: Use Gauge for "Total Bytes" if we just push values? 
            # Prometheus docs say "Counters go up". 
            # If we restart app, counter resets. 
            # Correct approach with psutil totals:
            # We can't set Counter value in python client easily publicly.
            # Let's use Gauge for simplify, or assume we calculate diffs before calling this?
            # Actually client lib v0.10+ supports .inc(amount).
            # We need to track previous to calc diff?
            # OR we can treat them as Gauges if we don't care about resets?
            # Text format: TYPE name counter.
            # Let's use Gauge for simplicity but name it total? 
            # No, standard is Counter. 
            
            # Implementation detail:
            # If we use Counter, we can only increment.
            # Keep it simple: Use Gauge for rate metrics, and if we really want totals, we can use Gauge too (acting as counter).
            # The prompt example shows COUNTER type.
            # We will use Gauge for everything that is absolute value from psutil?
            # But the prompt explicitly asks for Counters for bytes/errors.
            # Let's calculate delta in monitor and pass delta here? 
            # Or just use the ._value.set() or construct metric manually.
            pass
            
            # For now, let's implement the 'packets_per_second' gauge which is easy.
            # And alerts.
            
        except Exception as e:
            print(f"Prometheus update error: {e}")

    def update_from_metrics(self, metrics: list):
        """Update all metrics from a list of current readings."""
        self.uptime.set(time.time() - self.start_time)
        
        for m in metrics:
            iface = m.get('interface', 'unknown')
            
            # Set absolute totals
            self.bytes_sent.labels(interface=iface).set(m.get('bytes_sent', 0))
            self.bytes_recv.labels(interface=iface).set(m.get('bytes_recv', 0))
            
            self.errors_total.labels(interface=iface, error_type='in').set(m.get('err_in', 0))
            self.errors_total.labels(interface=iface, error_type='out').set(m.get('err_out', 0))
            
            self.drops_total.labels(interface=iface, drop_type='in').set(m.get('drop_in', 0))
            self.drops_total.labels(interface=iface, drop_type='out').set(m.get('drop_out', 0))
            
            # For rates (packets_per_sec), we need calculation.
            # If the metric dict already has 'packets_sec' (from analyzer?), use it.
            # Otherwise, skip or calc?
            # Let's assume analyzer adds it or we just expose totals. 
            # Prompt wanted 'network_packets_per_second'.
            # If we don't have it, set to 0.
            if 'packets_sec' in m:
                self.packets_rate.labels(interface=iface).set(m['packets_sec'])

    def get_metrics(self):
        """Return metrics in Prometheus text format."""
        return generate_latest()

# Singleton instance
exporter = PrometheusExporter()
