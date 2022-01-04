/** @returns {import('webpack').Configuration} Webpack Configuration */
module.exports = (config) => {
  // Disable automatically opening browser when starting the dev server
  config.devServer.open = false

  return config
}
