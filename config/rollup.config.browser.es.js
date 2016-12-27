import config from './rollup.config'

export default config({
  format: 'es',
  dest: 'lib/markymark.browser.es.js',
  browser: true
})
