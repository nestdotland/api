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
  async redirects() {
    return [
      {
        source: '/modules/:author',
        destination: '/users/:author/modules',
        permanent: true,
      },
    ];
  },
};
