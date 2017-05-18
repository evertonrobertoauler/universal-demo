const { ProgressPlugin, LoaderOptionsPlugin } = require('webpack');
const serverConfig = require('./src/server/webpack.config');
const browserConfig = require('./src/browser/webpack.config');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const _ = require('lodash');

const commonConfig = {
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.js'] },
  watchOptions: {
    poll: 1000
  },
  plugins: [
    new ProgressPlugin()
  ]
};

const optimizeConfig = {
  plugins: [
    new LoaderOptionsPlugin({
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
      return merge(commonConfig, serverConfig);
    case 'browser:dev':
      return merge(commonConfig, browserConfig);
    case 'browser:prod':
      return merge(merge(commonConfig, browserConfig), optimizeConfig);
  }
}

function merge(obj1, obj2) {
  return _.merge({}, obj1, _.keys(obj2).reduce((obj, key) => {
    if (_.isArray(obj1[key]) && _.isArray(obj2[key])) {
      obj[key] = _.concat(obj1[key], obj2[key]);
    } else {
      obj[key] = obj2[key];
    }

    return obj;
  }, {}));
}
