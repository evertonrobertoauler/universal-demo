const webpack = require('webpack');
const serverConfig = require('./src/server/webpack.config');
const browserConfig = require('./src/browser/webpack.config');
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
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: false
      },
      compress: {
        screw_ie8: true
      },
      comments: false,
      sourceMap: true,
      warningsFilter: () => false
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
