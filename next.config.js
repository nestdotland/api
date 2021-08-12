module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/api/',
      },
      {
        source: '/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};
