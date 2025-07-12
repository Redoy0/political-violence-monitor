/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Optimize webpack for better stability
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
    return config
  }
}

module.exports = nextConfig
