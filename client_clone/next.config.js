/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    IP2KEY: process.env.IP2KEY,
  },
  images: {
    domains: [
      "lh5.googleusercontent.com",
      "encrypted-tbn0.gstatic.com",
      "encrypted-tbn3.gstatic.com",
      "encrypted-tbn1.gstatic.com",
      "encrypted-tbn2.gstatic.com",
    ],
  },
};

module.exports = nextConfig;
