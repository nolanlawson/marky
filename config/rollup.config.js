import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'

export default config => {
  return {
    input: 'src/index.js',
    output: {
      format: config.format,
      file: config.dest,
      name: 'marky',
      esModule: !config.skipEsModule
    },
    plugins: [
      buble(),
      replace({'process.browser': JSON.stringify(!!config.browser)})
    ]
  }
}
