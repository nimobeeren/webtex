const esmDependencies = require("./esm-dependencies");

// Ignore all node_modules, except those listed as ESM dependencies
module.exports = {
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(${esmDependencies.join("|")}))`
  ]
};
