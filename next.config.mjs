/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization - use remotePatterns instead of deprecated `domains`
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "api.talentta.africa" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cloudinary.com" },
      // Keep localhost for local testing (http)
      { protocol: "http", hostname: "localhost" },
    ],
    unoptimized: true,
  },
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/src/api/:path*",
      },
    ];
  },
};

export default nextConfig;
