import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  images: {
    unoptimized: true
  },
  poweredByHeader: false
};

export default nextConfig;
