import config from './rollup.config'

export default config({
  format: 'es',
  dest: 'lib/markymark.es.js',
  browser: false
})