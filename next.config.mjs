const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')
const ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX || (BASE_PATH ? `${BASE_PATH}/` : '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dwtuxcnbr/image/upload/**',
      },
    ],
  },
  // Configuration pour sous-dossier via variables d'environnement (facultatives)
  ...(BASE_PATH ? { basePath: BASE_PATH } : {}),
  ...(ASSET_PREFIX ? { assetPrefix: ASSET_PREFIX } : {}),
}

export default nextConfig
