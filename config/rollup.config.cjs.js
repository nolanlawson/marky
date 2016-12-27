import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/markymark.cjs.js',
  browser: false
})
