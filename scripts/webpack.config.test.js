const path = require('path')
const glob = require('glob')

module.exports = {
  mode: 'development',
  entry: ['es6-promise/auto'].concat(glob.sync(path.resolve(__dirname, '../test/**/*.ts'))),
  output: {
    path: path.resolve(__dirname, '../.tmp'),
    filename: 'test.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loaders: ['webpack-espower-loader', 'ts-loader'] }
    ]
  },
  devtool: 'source-map'
}
