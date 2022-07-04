import perf from './performance'
import now from './now'

function throwIfEmpty (name) {
  if (!name) {
    throw new Error('name must be non-empty')
  }
}

// simple binary sort insertion
function insertSorted (arr, item) {
  let low = 0
  let high = arr.length
  let mid
  while (low < high) {
    mid = (low + high) >>> 1 // like (num / 2) but faster
    if (arr[mid].startTime < item.startTime) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  arr.splice(low, 0, item)
}

let mark
let stop
let getEntries
let clear

if (
  perf &&
  perf.mark &&
  perf.measure &&
  perf.getEntriesByName &&
  perf.getEntriesByType &&
  perf.clearMarks &&
  perf.clearMeasures &&
  // In Node, we want to detect that this perf/correctness fix [1] is available, which
  // landed in Node 16.15.0, 17.6.0, and 18.0.0. However, it's not observable, and
  // we don't want to rely on fragile version checks.
  // So we can rely on this observable change [2] to add clearResourceTimings, which
  // landed a bit later (18.2.0), but is close enough for our purposes.
  // [1]: https://github.com/nodejs/node/pull/42032
  // [2]: https://github.com/nodejs/node/pull/42725
  (process.browser || perf.clearResourceTimings)
) {
  mark = name => {
    throwIfEmpty(name)
    perf.mark(`start ${name}`)
  }
  stop = name => {
    throwIfEmpty(name)
    perf.mark(`end ${name}`)
    const measure = perf.measure(name, `start ${name}`, `end ${name}`)
    if (measure) {
      // return value from performance.measure not supported in all browsers
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure#browser_compatibility
      return measure
    }
    const entries = perf.getEntriesByName(name)
    return entries[entries.length - 1]
  }
  getEntries = () => perf.getEntriesByType('measure')
  clear = () => {
    perf.clearMarks()
    perf.clearMeasures()
  }
} else {
  let marks = {}
  let entries = []
  mark = name => {
    throwIfEmpty(name)
    const startTime = now()
    marks['$' + name] = startTime
  }
  stop = name => {
    throwIfEmpty(name)
    const endTime = now()
    const startTime = marks['$' + name]
    if (!startTime) {
      throw new Error(`no known mark: ${name}`)
    }
    const entry = {
      startTime,
      name,
      duration: endTime - startTime,
      entryType: 'measure'
    }
    // per the spec this should be at least 150:
    // https://www.w3.org/TR/resource-timing-1/#extensions-performance-interface
    // we just have no limit, per Chrome and Edge's de-facto behavior
    insertSorted(entries, entry)
    return entry
  }
  getEntries = () => entries
  clear = () => {
    marks = {}
    entries = []
  }
}

export { mark, stop, getEntries, clear }
