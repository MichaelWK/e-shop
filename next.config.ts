import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Seed data uses placeholder images from picsum.photos.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
