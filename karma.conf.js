/* eslint-env node */

const webpackConfig = require('./webpack.config.js')({}, {});

module.exports = function(config) {
    config.set({
        files: [
            {pattern: 'assets/tests.ts', watched: false},
        ],

        preprocessors: {
            'assets/tests.ts': ['webpack'],
        },

        webpack: {
            mode: 'development',
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
        },

        webpackMiddleware: {
            stats: 'errors-only'
        },

        reporters: ['dots'],
        frameworks: ['jasmine', 'webpack'],
        browsers: ['ChromeHeadless'],
    });
};
