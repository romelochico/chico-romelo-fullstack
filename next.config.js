/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zciisuujazkhroixldvv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig
