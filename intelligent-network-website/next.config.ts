import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', // Static export for GCS
  // GCS bucket path fixes
  basePath: isProd ? '/intelligent-network-website' : '',
  assetPrefix: isProd ? '/intelligent-network-website' : '',
  trailingSlash: true, // Creates folders for pages (e.g. /login -> /login/index.html)
  
  images: {
    unoptimized: true,
  },
  // rewrites() are not supported in static export
};

export default nextConfig;
