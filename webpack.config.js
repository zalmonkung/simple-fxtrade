const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

const browser = {
  entry: "./index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "browser.js",
    library: "fx",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        loader: "babel-loader",

        options: {
          presets: ["env"],
          plugins: ["lodash"]
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
    ],
  },

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  plugins: [
    new LodashModuleReplacementPlugin,
    new webpack.optimize.UglifyJsPlugin
  ]
}

const node = {
  entry: "./index.js",

  target: 'node',

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "node.js",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        loader: "babel-loader",

        options: {
          presets: ["env"],
          plugins: ["lodash"]
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
    ],
  },

  plugins: [
    new LodashModuleReplacementPlugin,
    new webpack.optimize.UglifyJsPlugin
  ]
}

module.exports = [browser, node];
