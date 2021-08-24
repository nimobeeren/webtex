const esmDependencies = require("./esm-dependencies");

let config = {
  reactStrictMode: true
};

// Explicitly add ESM dependencies to be transpiled
const withTM = require("next-transpile-modules")(esmDependencies);
config = withTM(config);

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  });
  config = withBundleAnalyzer(config);
}

module.exports = config;
