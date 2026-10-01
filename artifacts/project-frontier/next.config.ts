import type { NextConfig } from "next";

// Replit's forwarded preview host is multi-level (…worf.replit.dev), which
// "*.replit.dev" does not match. Allow the exact workspace host and the local
// Preview origin used by Replit, without broadly allowing arbitrary origins.
const allowedPreviewOrigins = [
  "*.replit.dev",
  "*.replit.app",
  process.env.REPLIT_DEV_DOMAIN,
  "127.0.0.1",
].filter((origin): origin is string => Boolean(origin));

const config: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: allowedPreviewOrigins,
  experimental: { cpus: 2 },
};
export default config;