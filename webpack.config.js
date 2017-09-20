const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './index.js',
  ],
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.js$/,
        exclude: /compiled_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  externals: [nodeExternals()],
};
