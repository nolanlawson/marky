import config from './rollup.config'

export default config({
  format: 'iife',
  dest: 'dist/markymark.js',
  browser: true
})
