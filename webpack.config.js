"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = function (env) {

  var isDevMode = (env == "dev");

  // We can mangle (compress) the following props for better minification, since they aren't used publicly
  var mangleProps = [
  ]

  var config = {
    node: {"fs": "empty"},
    context: path.resolve(__dirname, "src/js/"),
    entry: "./SimpleOekaki.js",
    output: {
      library: "SimpleOekaki",
      libraryTarget: "var",
      publicPath: "/test",
      path: path.resolve(__dirname, "dist"),
      filename: isDevMode ? "SimpleOekaki.js" : "SimpleOekaki.min.js",
      sourceMapFilename: isDevMode ? "SimpleOekaki.js.map" : "SimpleOekaki.min.js.map",
    },
    resolve: {
      extensions: [".js"],
      alias: {
        "ui": path.resolve(__dirname, "node_modules/iro.js/src/ui/"),
        "util": path.resolve(__dirname, "node_modules/iro.js/src/util/"),
        "colorModels": path.resolve(__dirname, "node_modules/iro.js/src/colorModels/"),
        "modules": path.resolve(__dirname, "node_modules/iro.js/src/modules/"),
      }
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: {
            loader: "babel-loader",
            options: {
              // "babelrc": true,
              "presets": ["env", "stage-2"]
            }
          }
        },
        {
          test: /\.[vf]sh$/,
          use: "raw-loader"
        },
        {
          test: /\.scss$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader" // compiles Sass to CSS
          }]
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: [
          "SimpleOekaki.js",
          "----------------",
          "Author: Srod Karim (github.com/Sind)",
          "Last updated: " + new Date().toDateString(),
        ].join("\n")
      }),
    ],
    devtool: "source-map",
    devServer: {
      port: process.env.PORT || 8080,
      host: "localhost",
      publicPath: "http://localhost:3000/",
      contentBase: path.join(__dirname, "./"),
      watchContentBase: false,
    }
  }

  if (!isDevMode) {
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        mangle: false
      })
    ]);
  }

  return config;
};