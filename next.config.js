/**
 * @type {import('next').NextConfig}
 */
let config = {
  reactStrictMode: true,
  experimental: { esmExternals: true }
};

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  });
  config = withBundleAnalyzer(config);
}

module.exports = config;
