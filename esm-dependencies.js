/**
 * List of dependencies that ship untranspiled ESM code.
 * Some of these are not direct dependencies, but Next.js build still fails if 
 * they are not in this list.
 */
module.exports = [
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
  'unist-util-remove',
  'unist-util-visit',
  'unist-util-visit-parents',
  'vfile'
]
