import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useNetworkStore from './store/useNetworkStore';
import { useWebSocket } from './hooks/useWebSocket';

// Layouts & Pages
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';

// Tabs converted to Pages (Direct Import or Lazy)
import AnalyticsTab from './components/AnalyticsTab';
import ModelStatusTab from './components/ModelStatusTab';
import AlertTable from './components/AlertTable'; 
// Note: AlertTable is a component, we might want a wrapper page for it.
// Let's create simple wrappers inline or import them if they were separate pages.

// Simple Wrapper Components for Routing
const AlertsPage = () => {
  const alerts = useNetworkStore(state => state.alerts);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Alerts</h2>
      <AlertTable alerts={alerts} />
    </div>
  );
};

const HistoryPage = () => (
  <div className="p-4 text-slate-600 dark:text-slate-400">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Historical Data</h2>
    <p>Historical charts and logs will appear here.</p>
  </div>
);

const WS_URL = 'ws://localhost:8000/ws';

function App() {
  // Global WebSocket Integration
  const { data, isConnected, error } = useWebSocket(WS_URL);
  const setMetrics = useNetworkStore((state) => state.setMetrics);
  const setConnectionStatus = useNetworkStore((state) => state.setConnectionStatus);
  const addAlert = useNetworkStore((state) => state.addAlert); // If WS sends single alerts
  
  // Sync WebSocket state to Zustand Store
  useEffect(() => {
    setConnectionStatus(isConnected);
  }, [isConnected, setConnectionStatus]);

  useEffect(() => {
    if (data.current) {
        // data.current from useWebSocket is the metrics list
        setMetrics(Array.isArray(data.current) ? data.current : [data.current]);
    }
    if (data.alerts && data.alerts.length > 0) {
        // Sync alerts. Note: useWebSocket hook accumulates alerts in its local state
        // For the store, we might want to sync the whole list or just new ones.
        // The store 'addAlert' adds one. 
        // Let's assume data.alerts is the full list from hook.
        // Actually, let's just use the store's alert logic and maybe update the hook to dispatch actions?
        // For Week 5 speed, let's just sync the 'alerts' list if compatible.
        // useNetworkStore has 'alerts' array.
        useNetworkStore.setState({ alerts: data.alerts });
    }
  }, [data, setMetrics]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<AnalyticsTab />} />
            <Route path="/ml-models" element={<ModelStatusTab />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
