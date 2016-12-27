/* global performance */

import now from './now'
import supportsMarkMeasure from './supportsMarkMeasure'
import { newFakeEntry } from './fakeEntry'

let mark
let measure

if (supportsMarkMeasure) {
  mark = performance.mark.bind(performance)
  measure = performance.measure.bind(performance)
} else {
  let marks = new Map()
  mark = name => {
    marks.set(name, now())
  }
  measure = (name, start, end) => {
    if (!marks.has(start)) {
      throw new Error(`no known mark: ${start}`)
    }
    if (!marks.has(end)) {
      throw new Error(`no known mark: ${end}`)
    }
    let startTime = marks.get(start)
    marks.delete(start)
    let endTime = marks.get(end)
    marks.delete(end)
    let duration = endTime - startTime
    newFakeEntry(name, duration)
  }
}

export { mark, measure }