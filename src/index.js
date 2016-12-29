/* global performance */

import now from './now'
import supportsMarkMeasure from './supportsMarkMeasure'
import insertSorted from './insertSorted'

function throwIfEmpty (name) {
  if (!name) {
    throw new Error('name must be non-empty')
  }
}

let mark
let stop
let getEntries

if (supportsMarkMeasure) {
  mark = name => {
    throwIfEmpty(name)
    performance.mark(`start ${name}`)
  }
  stop = name => {
    throwIfEmpty(name)
    performance.mark(`end ${name}`)
    performance.measure(name, `start ${name}`, `end ${name}`)
    let entries = performance.getEntriesByName(name)
    return entries[entries.length - 1]
  }
  getEntries = () => performance.getEntriesByType('measure')
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
    insertSorted(entries, entry, x => x.startTime)
    return entry
  }
  getEntries = () => entries
}

export { mark, stop, getEntries }
