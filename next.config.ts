import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // keep  existing Supabase bucket domain
    domains: ["ixatiutcoyuxqayxuucb.supabase.co"],
    // allow all the rotating Ravelry image hosts
    remotePatterns: [
      { protocol: "https", hostname: "**.ravelrycache.com" },
      { protocol: "https", hostname: "images.ravelry.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
    ],
  },
};

module.exports = nextConfig;
export default nextConfig;
