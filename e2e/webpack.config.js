/* eslint-env node */

const config = require('../webpack.config')({}, {});
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

config.mode = "development";

// workaround for https://github.com/jantimon/html-webpack-plugin/issues/1451
config.plugins = [
    new WebpackManifestPlugin({writeToFileEmit: true}),
];

module.exports = config;
