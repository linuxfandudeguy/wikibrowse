import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**", // Allow all image paths from Wikimedia Commons
      },
      {
        protocol: "https",
        hostname: "en.wikipedia.org",
        pathname: "/**", // Allow all image paths from English Wikipedia
      },
      {
        protocol: "https",
        hostname: "www.wikimedia.org",
        pathname: "/**", // Allow all image paths from Wikimedia main site
      },
    ],
  },
};

export default nextConfig;
