import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'lib/markymark.cjs.js',
  plugins: buble()
}
