// Configuration for the frontend
// In a real app, use NEXT_PUBLIC_API_URL env var
// For this GCS deployment, we hardcode the Cloud Run URL or fallback to localhost

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-nt6dnqkatq-uc.a.run.app";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://backend-nt6dnqkatq-uc.a.run.app";

// Helper to construct API endpoints
export const getApiUrl = (path: string) => {
    // Remove clean path slash if needed
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
};
