import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/marky.cjs.js',
  browser: false
})
