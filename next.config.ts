import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["media.discordapp.net", "cdn.discordapp.com"],
  },
};

module.exports = nextConfig;
export default nextConfig;
