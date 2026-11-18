/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  // Permite compilar producción en otra carpeta sin pisar el servidor de desarrollo.
  distDir: process.env.NEXT_DIST_DIR || '.next',
}

module.exports = nextConfig
