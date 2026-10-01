import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["*.replit.dev", "*.replit.app"],
  experimental: { cpus: 2 },
};
export default config;