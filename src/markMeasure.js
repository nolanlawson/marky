/* global performance */

import now from './now'
import supportsMarkMeasure from './supportsMarkMeasure'

let mark
let measure

if (supportsMarkMeasure) {
  mark = name => {
    performance.mark(name)
  }
  measure = (name, start, end) => {
    performance.measure(name, start, end)
    let entries = performance.getEntriesByName(name)
    return entries[entries.length - 1]
  }
} else {
  let marks = {}
  mark = name => {
    let time = now()
    marks['$' + name] = time
  }
  measure = (name, start, end) => {
    let startTime = marks['$' + start]
    if (!startTime) {
      throw new Error(`no known mark: ${start}`)
    }
    let endTime = marks['$' + end]
    delete marks['$' + start]
    delete marks['$' + end]
    let duration = endTime - startTime
    return {
      startTime,
      duration,
      name,
      entryType: 'measure'
    }
  }
}

export { mark, measure }
