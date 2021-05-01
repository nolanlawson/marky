import config from './rollup.config'

export default config({
  format: 'iife',
  dest: 'dist/marky.js',
  browser: true,
  skipEsModule: true // don't add __esModule for IIFE output to maintain backwards compat with marky <=v1.2.1
})
