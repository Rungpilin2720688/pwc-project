import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained server bundle for the Docker image.
  output: "standalone",
  // Pin the tracing root to this project so a stray lockfile in a parent directory can't change the bundle layout.
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
};

export default nextConfig;
