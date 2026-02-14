import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Changed from 'export' to support rewrites/proxy
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to FastAPI backend
      },
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8000/ws/:path*', // Proxy WebSocket (though client usually connects directly)
      },
    ];
  },
};

export default nextConfig;
