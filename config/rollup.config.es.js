import config from './rollup.config'

export default config({
  format: 'es',
  dest: 'lib/marky.es.js',
  browser: false
})
