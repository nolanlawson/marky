import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/marky.browser.cjs.js',
  browser: true
})
