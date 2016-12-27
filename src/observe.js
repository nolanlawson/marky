/* global PerformanceObserver */

import supportsMarkMeasure from './supportsMarkMeasure'
import { onNewFakeEntry } from './fakeEntry'

let deferreds = new Map()

function processList(entries) {
  for (let i = 0, len = entries.length; i < len; i++) {
    let entry = entries[i]
    let deferred = deferreds.get(entry.name)
    if (deferred) {
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
  let len = 0
  setInterval(() => {
    let entries = performance.getEntriesByType('measure')
    if (entries.length > len) {
      processList(entries.slice(len))
      len = entries.length
    }
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