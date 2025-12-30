import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.clerk.com"],
  },

  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
