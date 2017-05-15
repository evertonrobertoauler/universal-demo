const { join } = require('path');
const nodeExternals = require('webpack-node-externals');
const { CommonsChunkPlugin } = require('webpack').optimize;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AotPlugin } = require('@ngtools/webpack');

const entryPoints = ['styles', 'vendor', 'main'];

const DIR = join(process.cwd(), 'src', 'browser');
const APP_DIR = join(DIR, '..', 'app');

module.exports = {
  context: DIR,
  entry: { main: './browser.ts' },
  target: 'web',
  output: {
    path: join(process.cwd(), 'dist', 'public'),
    filename: '[name].[hash:6].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, include: [DIR], use: { loader: 'ts-loader' } },
      { test: /\.ts$/, include: [APP_DIR], use: { loader: '@ngtools/webpack' } },
      { test: /\.html$/, include: [APP_DIR], use: { loader: 'raw-loader' } },
      {
        test: /\.scss$/, include: [DIR], use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.scss$/, include: [APP_DIR], use: [
          'exports-loader?module.exports.toString()',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.[hash:6].css'),
    new AotPlugin({
      tsConfigPath: join(APP_DIR, 'tsconfig.json'),
      skipCodeGeneration: false
    }),
    new CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: (module) => module.resource && module.resource.startsWith(join(process.cwd(), 'node_modules')),
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: join(DIR, 'index.html'),
      filename: './index.html',
      chunksSortMode: (left, right) => {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        return leftIndex - rightindex;
      }
    }),
    new CopyWebpackPlugin([{ from: join(APP_DIR, 'assets'), to: 'assets' }]),
    new WebpackCleanupPlugin({ exclude: ['index.html', 'assets/**'] })
  ]
};
