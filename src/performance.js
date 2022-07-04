/* global performance */

const perf = typeof performance !== 'undefined' && performance

// Require that the performance object supports some basic APIs we need
export default perf &&
  perf.mark &&
  perf.measure &&
  perf.clearMarks &&
  perf.clearMeasures &&
  perf.getEntriesByName &&
  perf.getEntriesByType &&
// In Node, we want to detect that this perf/correctness fix [1] is available, which
// landed in Node 16.15.0, 17.6.0, and 18.0.0. However, it's not observable, and
// we don't want to rely on fragile version checks.
// So we can rely on this observable change [2] to add clearResourceTimings, which
// landed a bit later (18.2.0), but is close enough for our purposes.
// [1]: https://github.com/nodejs/node/pull/42032
// [2]: https://github.com/nodejs/node/pull/42725
(process.browser || performance.clearResourceTimings) &&
  perf
