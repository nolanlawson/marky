import config from './rollup.config'

export default config({
  format: 'iife',
  dest: 'dist/marky.js',
  browser: true
})
