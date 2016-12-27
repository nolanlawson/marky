import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/markymark.browser.with-polyfills.cjs.js',
  browser: true,
  polyfills: true
})