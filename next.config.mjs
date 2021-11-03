const nextMdx = (await import("@next/mdx")).default;
const rehypeKatex = (await import("rehype-katex")).default;
const remarkFrontmatter = (await import("remark-frontmatter")).default;
const remarkGfm = (await import("remark-gfm")).default;
const remarkMath = (await import("remark-math")).default;
const remarkSlug = (await import("remark-slug")).default;

/**
 * @type {import('next').NextConfig}
 */
let config = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"]
};

if (process.env.ANALYZE === "true") {
  const nextBundleAnalyzer = (await import("@next/bundle-analyzer")).default;
  const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: true
  });
  config = withBundleAnalyzer(config);
}

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkSlug, remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
    providerImportSource: "@mdx-js/react"
  }
});
config = withMDX(config);

export default config;
