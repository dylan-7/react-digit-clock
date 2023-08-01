/* eslint-disable */
var path = require('path')

module.exports = function (env = {}) {
  return {
    mode: env.pro ? 'production' : 'development',
    devtool: env.pro ? 'source-map' : 'cheap-module-source-map',
    watch: !env.pro,
    entry: './demo/demo.tsx',
    cache: false,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, './tsconfig.demo.json'),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpg)$/,
          use: 'url-loader?limit=512',
        },
      ],
    },
  };
};
