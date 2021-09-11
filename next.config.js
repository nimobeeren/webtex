/**
 * @type {import('next').NextConfig}
 */
let config = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  pageExtensions: ["js", "ts", "tsx", "md", "mdx"]
};

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/
});
config = withMDX(config);

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  });
  config = withBundleAnalyzer(config);
}

module.exports = config;
