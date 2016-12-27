/* global PerformanceObserver */

import supportsMarkMeasure from './supportsMarkMeasure'
import { onNewFakeEntry } from './fakeEntry'

let deferreds = new Map()

function processList(entries) {
  for (let i = 0, len = entries.length; i < len; i++) {
    let entry = entries[i]
    if (entry.__observed) {
      continue
    }
    let deferred = deferreds.get(entry.name)
    if (deferred) {
      entry.__observed = true
      deferreds.delete(entry.name)
      deferred(entry.duration)
    }
  }
}

function onObserve(entriesList) {
  processList(entriesList.getEntriesByType('measure'))
}

if (typeof PerformanceObserver === 'function') {
  let observer = new PerformanceObserver(onObserve)
  observer.observe({entryTypes: ["measure"]})
} else if (supportsMarkMeasure) {
  setInterval(() => {
    let entries = performance.getEntriesByType('measure')
    processList(entries)
  }, 2000)
} else {
  onNewFakeEntry(processList)
}

function observe(name) {
  return new Promise(resolve => {
    deferreds.set(name, resolve)
  })
}

export default observe