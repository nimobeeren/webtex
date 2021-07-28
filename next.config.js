let config = {
  reactStrictMode: true
}

const withTM = require('next-transpile-modules')([
  'unified',
  'lodash-es',
  'unist-util-visit'
])
config = withTM(config)

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  config = withBundleAnalyzer(config)
}

module.exports = config
