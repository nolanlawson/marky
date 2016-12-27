import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/markymark.with-polyfills.cjs.js',
  browser: false,
  polyfills: true
})
