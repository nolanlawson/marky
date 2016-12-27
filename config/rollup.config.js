import buble from 'rollup-plugin-buble'
import replace from 'rollup-plugin-replace'
import inject from 'rollup-plugin-inject'
import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'

export default config => {
  let plugins = [
    buble(),
    replace({'process.browser': JSON.stringify(!!config.browser)})
  ]
  if (config.polyfills) {
    plugins.push(inject({
      exclude: 'node_modules/**',
      Promise: 'lie',
      Map: 'es6-map'
    }))
    if (config.format === 'iife') {
      plugins = plugins.concat([resolve(), cjs()])
    }
  }
  return {
    entry: 'src/index.js',
    format: config.format,
    moduleName: 'markymark',
    dest: config.dest,
    plugins: plugins
  }
}
