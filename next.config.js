/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  reactStrictMode: true,
  output: 'standalone',

  // Vercel-compatible image domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.steamstatic.com' },
      { protocol: 'https', hostname: 'community.cloudflare.steamstatic.com' },
      { protocol: 'https', hostname: 'steamcommunity.com' },
    ],
  },
}

module.exports = nextConfig;
