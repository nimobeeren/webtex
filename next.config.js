/**
 * @type {import('next').NextConfig}
 */
let config = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  pageExtensions: ["js", "ts", "tsx", "md", "mdx"]
};

// LEFT HERE
// Trying to find a way to import ESM modules from this CJS file,
// but it doesn't seem possible, hence I can't use any remark plugins.
// May need to move away from @next/mdx
console.log(require.resolve('remark-slug'));

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  config: {
    remarkPlugins: []
  }
});
config = withMDX(config);

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  });
  config = withBundleAnalyzer(config);
}

module.exports = config;
