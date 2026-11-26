import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
  },
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:path*.php",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
