const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

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
            ['@babel/env', {
              targets: {
                browsers: 'last 2 versions',
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
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            warnings: !isProd,
          },
          sourceMap: true,
        },
      }),
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      CANNON: 'cannon',
      THREE: 'three',
    }),
    new HtmlWebpackPlugin({
      googleAnalytics: process.env.GA_TRACKING_ID,
      template: './src/index.ejs',
      title: '3D Space Invasion',
    }),
  ],
};
