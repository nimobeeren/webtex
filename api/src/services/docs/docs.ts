import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'

const docsDirectory = join(process.cwd(), 'docs')

export type Doc = {
  slug: string
  content: string
  frontmatter: {
    title?: string
    [key: string]: unknown
  }
}

export function docBySlug({ slug }): Doc {
  const path = fs
    .readdirSync(docsDirectory)
    .find((path) => new RegExp(`${slug}\.mdx?$`).test(path))

  if (!path) {
    throw new Error(`Could not find doc with slug ${slug}`)
  }

  const rawContent = fs.readFileSync(join(docsDirectory, path), 'utf-8')
  const { content, data } = matter(rawContent)

  return {
    slug,
    content,
    frontmatter: data
  }
}

export function docSlugs(): string[] {
  return fs
    .readdirSync(docsDirectory)
    .filter((path) => /\.mdx?$/.test(path))
    .map((filename) => filename.replace(/\.mdx?$/, ''))
}

export function docs(): Doc[] {
  const slugs = docSlugs()
  return slugs.map((slug) => docBySlug({ slug }))
}
