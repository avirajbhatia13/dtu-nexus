import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't get confused by other
  // lockfiles higher up the filesystem.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
