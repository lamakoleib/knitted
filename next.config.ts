import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["media.discordapp.net", "cdn.discordapp.com"],
  },
}

module.exports = nextConfig
export default nextConfig
