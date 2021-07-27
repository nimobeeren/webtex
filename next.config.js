const remarkMath = require('remark-math')
const rehypeKatex = require('rehype-katex')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
})

const withTM = require('next-transpile-modules')([
  'unified',
  'lodash-es',
  'unist-util-visit'
])

module.exports = withTM(
  withMDX({
    reactStrictMode: true,
    pageExtensions: ['js', 'ts', 'tsx', 'md', 'mdx']
  })
)
