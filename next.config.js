// next.config.js
const webpack = require('webpack');
const withCSS = require('@zeit/next-css');
const registerEnvFile = require('./utils/envVars');

const localEnv = registerEnvFile();

module.exports = withCSS({
  cssModules: true,
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack(config, options) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    return config;
  },
});
