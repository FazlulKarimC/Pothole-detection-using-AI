import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "faz-ai-pothole-detection.hf.space",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.gradio.live",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
