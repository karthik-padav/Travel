/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    IP2KEY: process.env.IP2KEY,
  },
  images: {
    domains: ["lh5.googleusercontent.com"],
  },
};

module.exports = nextConfig;
