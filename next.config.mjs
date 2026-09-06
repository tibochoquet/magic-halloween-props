/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /terms was the old English route; the Dutch legal route is canonical.
      { source: "/terms", destination: "/algemene-voorwaarden", permanent: true },
    ];
  },
};

export default nextConfig;
