import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export for GitHub Pages
  output: 'export',

  // Images must be unoptimized for static export
  images: {
    unoptimized: true,
  },

  // Required for deploying to github.io/repo-name
  basePath: '/tp-tracker-app',
  assetPrefix: '/tp-tracker-app',
};

export default nextConfig;
