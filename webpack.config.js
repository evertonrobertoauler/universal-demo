const webpack = require('webpack');
const serverConfig = require('./src/server/webpack.config');
const browserConfig = require('./src/browser/webpack.config');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const _ = require('lodash');

const commonConfig = {
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.js'] },
  watchOptions: {
    poll: 1000
  }
};

const optimizeConfig = {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT5',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED'
      },
      concurrency: 3,
    })
  ]
};

module.exports = function (env) {
  switch (env) {
    case 'server':
      return _.assign({}, commonConfig, serverConfig);
    case 'browser:dev':
      return _.assign({}, commonConfig, browserConfig);
    case 'browser:prod':
      return _.assign({}, commonConfig, browserConfig, {
        plugins: browserConfig.plugins.concat(optimizeConfig.plugins)
      });
  }
}
