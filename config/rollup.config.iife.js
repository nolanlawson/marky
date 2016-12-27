import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  format: 'iife',
  moduleName: 'markymark',
  dest: 'dist/markymark.js',
  plugins: buble()
}
