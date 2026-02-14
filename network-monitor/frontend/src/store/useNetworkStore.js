import { create } from 'zustand';

const useNetworkStore = create((set) => ({
  metrics: [],
  alerts: [],
  history: [],
  mlStatus: null,
  isConnected: false,
  isAuthenticated: Boolean(localStorage.getItem('token')),
  user: null, // In real app, decode token or fetch /me
  darkMode: localStorage.getItem('theme') === 'dark',

  setMetrics: (metrics) => set({ metrics }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 100) })), // Keep last 100
  setHistory: (history) => set({ history }),
  setMlStatus: (status) => set({ mlStatus: status }),
  setConnectionStatus: (status) => set({ isConnected: status }),

  login: (user) => {
    localStorage.setItem('token', 'mock-jwt-token'); // Replace with real token
    set({ isAuthenticated: true, user });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null });
  },

  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode;
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    return { darkMode: newMode };
  }),
}));

export default useNetworkStore;
