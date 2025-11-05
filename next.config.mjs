/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/sustainable-nextjs',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
