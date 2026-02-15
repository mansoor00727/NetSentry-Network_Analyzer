import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized for Docker/Cloud Run
  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
