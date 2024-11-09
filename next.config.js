/**
 * @type {import('next').NextConfig}
 */

const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

const defaultBasePath = '';
const defaultFallbackUrl = 'https://helpqueue.tamudatathon.com/*';

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname)]
  },
  env: {
    BASE_PATH: process.env.BASE_PATH || defaultBasePath,
    DATABASE_URL: process.env.MONGODB_URI
  },
  basePath: process.env.BASE_PATH || defaultBasePath,
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
