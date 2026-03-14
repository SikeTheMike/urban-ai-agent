import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@databricks/sql", "lz4"],
  /* Other config options here */
};

export default nextConfig;