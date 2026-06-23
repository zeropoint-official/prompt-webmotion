import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next detects a stray
  // C:\Users\konst\package-lock.json and roots Turbopack at the home directory,
  // making it watch the entire user profile — 20s+ compiles and dev crashes.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "www.twblocks.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/category/:id", destination: "/library", permanent: true },
      { source: "/how-to-use", destination: "/guide", permanent: true },
      { source: "/recipes", destination: "/guide#recipes", permanent: true },
      {
        source: "/checkpoint",
        destination: "/guide#checkpoint",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
