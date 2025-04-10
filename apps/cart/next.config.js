/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@chakra-ui/react', '@tanstack/react-query'],
  images: {
    domains: ['*'], // Permitir imagens de qualquer domínio (você pode restringir isso depois)
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.library = {
        type: 'umd',
        name: 'cart',
      };
      config.output.publicPath = 'auto';
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/remoteCheckout.js',
        destination: '/_next/static/remoteCheckout.js',
      },
    ];
  },
};

module.exports = nextConfig;
