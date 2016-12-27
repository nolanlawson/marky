import buble from 'rollup-plugin-buble'
import replace from 'rollup-plugin-replace'

export default config => ({
  entry: 'src/index.js',
  format: config.format,
  moduleName: 'markymark',
  dest: config.dest,
  plugins: [
    buble(),
    replace({BROWSER: JSON.stringify(!!config.browser)})
  ]
})