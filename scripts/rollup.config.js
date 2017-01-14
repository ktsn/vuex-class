const replace = require('rollup-plugin-replace')
const meta = require('../package.json')

const config = {
  entry: 'lib/index.js',
  moduleName: 'Lib',
  plugins: [],
  banner: `/*!
 * ${meta.name} v${meta.version}
 * ${meta.homepage}
 *
 * @license
 * Copyright (c) 2016 ${meta.author}
 * Released under the MIT license
 * ${meta.homepage}/blob/master/LICENSE
 */`
}

switch (process.env.BUILD) {
  case 'commonjs':
    config.dest = `dist/${meta.name}.cjs.js`
    config.format = 'cjs'
    break
  case 'development':
    config.dest = `dist/${meta.name}.js`
    config.format = 'umd'
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    )
    break
  case 'production':
    config.format = 'umd'
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    )
    break
  default:
    throw new Error('Unknown build environment')
}

module.exports = config
