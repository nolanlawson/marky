import config from './rollup.config'

export default config({
  format: 'iife',
  dest: 'dist/markymark.with-polyfills.js',
  browser: true,
  polyfills: true
})