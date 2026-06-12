import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
