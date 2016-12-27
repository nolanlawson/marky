/* global performance */

import now from './now'
import supportsMarkMeasure from './supportsMarkMeasure'

let mark
let measure

if (supportsMarkMeasure) {
  mark = performance.mark
  measure = performance.measure
} else {
  mark = name => {

  }
  measure = (name, start, end) => {

  }
}

export { mark, measure }