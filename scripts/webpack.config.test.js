const path = require('path')
const glob = require('glob')

module.exports = {
  entry: ['es6-promise/auto', path.resolve(__dirname, '../test/setup.ts')]
    .concat(glob.sync(path.resolve(__dirname, '../test/**/*.spec.ts'))),
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
