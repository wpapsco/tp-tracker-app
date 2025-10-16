import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export for GitHub Pages
  output: 'export',

  // Images must be unoptimized for static export
  images: {
    unoptimized: true,
  },

  // Uncomment these if deploying to github.io/repo-name (not a custom domain)
  // basePath: '/tp-tracker-app',
  // assetPrefix: '/tp-tracker-app',
};

export default nextConfig;
