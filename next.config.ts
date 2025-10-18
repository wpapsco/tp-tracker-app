import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export for GitHub Pages
  output: 'export',

  // Images must be unoptimized for static export
  images: {
    unoptimized: true,
  },

  // For deploying to github.io/tp-tracker-app
  basePath: '/tp-tracker-app',
  assetPrefix: '/tp-tracker-app',
};

export default nextConfig;
