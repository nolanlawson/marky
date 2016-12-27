import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  format: 'es',
  dest: 'lib/markymark.es.js',
  plugins: buble()
}
