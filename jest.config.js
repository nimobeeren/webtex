module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    // While Jest uses babel-jest by default, we explicitly set it here because
    // that allows us to not have a Babel configuration file (instead we pass
    // the Babel options here). And if we don't have a babel configuration file,
    // Next.js will use its fast compiler (SWC).
    // Be careful, any Babel plugins added here will only run in tests, not in
    // development/production.
    "\\.[jt]sx?$": ["babel-jest", { presets: ["next/babel"] }]
  }
};
