/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/ufc',
        destination: 'http://localhost:5001/ufc',
      },
      {
        source: '/api/onefc',
        destination: 'http://localhost:5001/onefccalendar',
      },
    ]
  },
}

module.exports = nextConfig
