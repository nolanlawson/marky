import config from './rollup.config'

export default config({
  format: 'es',
  dest: 'lib/marky.browser.es.js',
  browser: true
})
