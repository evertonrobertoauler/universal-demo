const { ProgressPlugin, LoaderOptionsPlugin, optimize } = require('webpack');
const serverConfig = require('./src/server/webpack.config');
const browserConfig = require('./src/browser/webpack.config');
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
    new optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: false
      },
      compress: {
        screw_ie8: true,
        warnings: false
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
