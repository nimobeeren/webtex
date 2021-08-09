let config = {
  reactStrictMode: true
}

const withTM = require('next-transpile-modules')([
  'array-iterate',
  'hastscript',
  'hast-to-hyperscript',
  'hast-util-parse-selector',
  'hast-util-raw',
  'hast-util-sanitize',
  'hast-util-to-parse5',
  'lodash-es',
  'remark-slug',
  'rehype-raw',
  'rehype-sanitize',
  'unified',
  'unist-builder',
  'unist-util-modify-children',
  'unist-util-visit',
  'unist-util-visit-parents',
  'vfile'
])
config = withTM(config)

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true
  })
  config = withBundleAnalyzer(config)
}

module.exports = config
