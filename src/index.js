/* global performance */

import now from './now'
import supportsMarkMeasure from './supportsMarkMeasure'

function throwIfEmpty (name) {
  if (!name) {
    throw new Error('name must be non-empty')
  }
}

let mark
let stop

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
} else {
  let marks = {}
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
    return {
      startTime,
      name,
      duration: endTime - startTime,
      entryType: 'measure'
    }
  }
}

export { mark, stop }
