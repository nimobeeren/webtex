let config = {
  reactStrictMode: true
}

const withTM = require('next-transpile-modules')([
  'array-iterate',
  'hastscript',
  'hast-util-parse-selector',
  'lodash-es',
  'unified',
  'unist-util-modify-children',
  'unist-util-visit',
  'unist-util-visit-parents'
])
config = withTM(config)

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true
  })
  config = withBundleAnalyzer(config)
}

module.exports = config
