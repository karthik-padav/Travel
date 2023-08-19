/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    IP2KEY: process.env.IP2KEY,
    IMAGE_BASE_URL: process.env.IMAGE_BASE_URL || "",
    BASE_URL: process.env.BASE_URL || "http://localhost:3001",
    IP_INFO: process.env.IP_INFO,
    MAX_DISTANCE: process.env.MAX_DISTANCE,
  },
  images: {
    domains: [
      "lh5.googleusercontent.com",
      "encrypted-tbn0.gstatic.com",
      "encrypted-tbn3.gstatic.com",
      "encrypted-tbn1.gstatic.com",
      "encrypted-tbn2.gstatic.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
