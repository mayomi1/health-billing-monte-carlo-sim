/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removing 'output: export' as it's incompatible with server actions
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
