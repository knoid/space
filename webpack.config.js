const HtmlWebpackPlugin = require('html-webpack-plugin');
const {optimize} = require('webpack');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  devtool: isProd ? 'source-map' : 'eval-source-map',
  devServer: {
    contentBase: './dist',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ['env', {
              targets: {
                browsers: 'last 2 versions',
                uglify: true,
              },
            }],
          ],
        },
      },
      {
        test: /\.alien$/,
        loader: path.resolve(__dirname, 'src/alien-loader.js'),
      },
    ],
  },
  plugins: [
    new optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        warnings: !isProd,
      },
      sourceMap: true,
    }),
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ],
};
