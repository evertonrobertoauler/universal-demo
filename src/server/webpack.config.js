const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

const { AotPlugin } = require('@ngtools/webpack');

const DIR = join(process.cwd(), 'src', 'server');
const APP_DIR = join(DIR, '..', 'app');

module.exports = {
  context: DIR,
  entry: { server: './server.ts' },
  target: 'node',
  externals: [
    nodeExternals({ whitelist: [] })
  ],
  output: {
    path: join(process.cwd(), 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, include: [DIR], use: { loader: 'ts-loader' } },
      { test: /\.ts$/, include: [APP_DIR], use: { loader: '@ngtools/webpack' } },
      { test: /\.html$/, include: [APP_DIR], use: { loader: 'raw-loader' } }
    ]
  },
  plugins: [
    new AotPlugin({
      tsConfigPath: join(APP_DIR, 'tsconfig.json'),
      skipCodeGeneration: false
    })
  ]
};
