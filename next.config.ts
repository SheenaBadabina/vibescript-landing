import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* Add Next.js config here as needed */
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;

// Enable OpenNext Cloudflare integration during local dev
// (safe to include; it no-ops in production)
initOpenNextCloudflareForDev();
