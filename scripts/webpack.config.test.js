const path = require('path')
const glob = require('glob')

module.exports = {
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
      { test: /\.ts$/, loaders: ['ts-loader'] }
    ]
  },
  devtool: 'source-map'
}
