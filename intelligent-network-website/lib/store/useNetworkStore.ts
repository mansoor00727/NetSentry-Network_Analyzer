import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NetworkState {
  metrics: any[];
  token: string | null;
  devices: string[];
  selectedDevice: string;
  deviceHistory: Record<string, any[]>;
  
  addMetric: (metric: any) => void;
  setToken: (token: string | null) => void;
  selectDevice: (deviceId: string) => void;
  logout: () => void;
}

const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      metrics: [],
      token: null,
      devices: ['server'],
      selectedDevice: 'server',
      deviceHistory: { 'server': [] },
      
      addMetric: (metric: any) => {
        const state = get();
        const deviceId = metric.device_id || 'server';
        
        // Update history for this device
        const currentHistory = state.deviceHistory[deviceId] || [];
        const newHistory = [metric, ...currentHistory].slice(0, 50);
        
        const newDeviceHistory = {
            ...state.deviceHistory,
            [deviceId]: newHistory
        };
        
        // Update device list if new
        const newDevices = state.devices.includes(deviceId) 
            ? state.devices 
            : [...state.devices, deviceId];
            
        // If this is the selected device, update main metrics
        // If we connect a new device and nothing is selected, select it? No, keep server default.
        const newMetrics = (deviceId === state.selectedDevice) 
            ? newHistory 
            : state.metrics;
            
        set({
            deviceHistory: newDeviceHistory,
            devices: newDevices,
            metrics: newMetrics
        });
      },
      
      selectDevice: (deviceId: string) => {
          const state = get();
          set({
              selectedDevice: deviceId,
              metrics: state.deviceHistory[deviceId] || []
          });
      },
      
      setToken: (token: string | null) => set({ token }),
      logout: () => set({ token: null, metrics: [], devices: ['server'], selectedDevice: 'server', deviceHistory: {'server': []} }),
    }),
    {
      name: 'network-storage',
      partialize: (state) => ({ token: state.token }), 
    }
  )
);

export default useNetworkStore;
