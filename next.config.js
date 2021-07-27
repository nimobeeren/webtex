const withTM = require('next-transpile-modules')([
  'unified',
  'lodash-es',
  'unist-util-visit'
])

module.exports = withTM({
  reactStrictMode: true
})
