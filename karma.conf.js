const resolve = require('@rollup/plugin-node-resolve').default
const cjs = require('@rollup/plugin-commonjs')

module.exports = function (config) {
  config.set({
    plugins: [
      require('karma-rollup-preprocessor'),
      require('karma-mocha'),
      require('karma-chrome-launcher')
    ],

    files: [
      'test/test.js'
    ],

    preprocessors: {
      'test/test.js': ['rollup']
    },

    rollupPreprocessor: {
      plugins: [
        resolve({
          mainFields: ['browser', 'module', 'main'],
          preferBuiltins: false
        }),
        cjs()
      ],
      output: {
        format: 'iife', // Helps prevent naming collisions.
        name: 'Test', // Required for 'iife' format.
        sourcemap: 'inline' // Sensible for testing.
      }
    },

    frameworks: ['mocha'],

    browsers: [
      'ChromeHeadless'
    ],
    ...(process.env.COVERAGE ? {
      reporters: ['coverage']
    } : null)
  })
}
