import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: "4200",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crowdprom.s3.ca-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
