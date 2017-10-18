const replace = require('rollup-plugin-replace')
const meta = require('../package.json')

const banner = `/*!
 * ${meta.name} v${meta.version}
 * ${meta.homepage}
 *
 * @license
 * Copyright (c) 2017 ${meta.author}
 * Released under the MIT license
 * ${meta.homepage}/blob/master/LICENSE
 */`

const config = {
  input: 'lib/index.js',
  output: {
    name: 'VuexClass',
    globals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-class-component': 'VueClassComponent'
    },
    banner
  },
  plugins: [],
  external: [
    'vue',
    'vuex',
    'vue-class-component'
  ]
}

switch (process.env.BUILD) {
  case 'commonjs':
    config.output.file = `dist/${meta.name}.cjs.js`
    config.output.format = 'cjs'
    break
  case 'development':
    config.output.file = `dist/${meta.name}.js`
    config.output.format = 'umd'
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    )
    break
  case 'production':
    config.output.format = 'umd'
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
