import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.IS_CAPACITOR === "true" ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
