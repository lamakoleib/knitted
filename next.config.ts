import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["ixatiutcoyuxqayxuucb.supabase.co"],
  },
}

module.exports = nextConfig
export default nextConfig
