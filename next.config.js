/**
 * @type {import('next').NextConfig}
 */

const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

const defaultBasePath = '/help';
const defaultFallbackUrl = 'https://tamudatathon.com/:path*';

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname)]
  },
  env: {
    BASE_PATH: process.env.BASE_PATH || defaultBasePath,
    MONGODB_URI: process.env.MONGODB_URI
  },
  basePath: process.env.BASE_PATH || defaultBasePath,
  images: {
    domains: ['tamudatathon.com'],
  },
  compiler: {
    styledComponents: true
  },
  async rewrites() {
    return {
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: '/:path*',
          basePath: false,
          destination: process.env.FALLBACK_URL || defaultFallbackUrl
        }
      ]
    };
  }
}

module.exports = nextConfig