/* global performance */

function safeRequire (mod) {
  try {
    return require(mod)
  } catch (err) {
    // ignore
  }
}

export default process.browser
  ? (typeof performance !== 'undefined' && performance)
  : safeRequire('perf_hooks')
