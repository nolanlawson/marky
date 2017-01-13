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

if (perf && perf.mark && perf.measure) {
  mark = name => {
    throwIfEmpty(name)
    perf.mark(`start ${name}`)
  }
  stop = name => {
    throwIfEmpty(name)
    perf.mark(`end ${name}`)
    perf.measure(name, `start ${name}`, `end ${name}`)
    let entries = perf.getEntriesByName(name)
    return entries[entries.length - 1]
  }
  getEntries = () => perf.getEntriesByType('measure')
} else {
  let marks = {}
  let entries = []
  mark = name => {
    let startTime = now()
    throwIfEmpty(name)
    marks['$' + name] = startTime
  }
  stop = name => {
    let endTime = now()
    throwIfEmpty(name)
    let startTime = marks['$' + name]
    if (!startTime) {
      throw new Error(`no known mark: ${name}`)
    }
    let entry = {
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
}

export { mark, stop, getEntries }
