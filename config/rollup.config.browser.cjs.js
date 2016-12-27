import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/markymark.browser.cjs.js',
  browser: true
})