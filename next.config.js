/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['localhost', 'supabase.co'],
  },
}

module.exports = nextConfig
