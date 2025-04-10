/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@chakra-ui/next-js'],
  images: {
    domains: [
      'source.unsplash.com',
      'fakestoreapi.com',
      'i.pravatar.cc',
      'picsum.photos',
    ],
  },
};

module.exports = nextConfig;
