const config = require('../webpack.config');

module.exports = (_env, argv) => ({
    ...config,
    output: {
        ...config.output,
        publicPath: argv.mode === 'development' ? config.output.publicPath : '/static/dist/',
    },
});
