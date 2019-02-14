const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
require("babel-polyfill");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  devtool: "source-map",
  entry: ["babel-polyfill", __dirname + "/src/index.js"],
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "AI Pong",
      template: "src/assets/index.html"
    }),
    new CopyWebpackPlugin([
      {
        from: "src/assets/css/main.css",
        to: "css/main.css"
      }
    ])
  ]
};
