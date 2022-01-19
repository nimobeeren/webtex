/**
 * @type {import('next').NextConfig}
 */
let config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/project/draft",
        permanent: false
      }
    ];
  }
};

if (process.env.ANALYZE === "true") {
  const nextBundleAnalyzer = require("@next/bundle-analyzer");
  const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: true
  });
  config = withBundleAnalyzer(config);
}

module.exports = config;
