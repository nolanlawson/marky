/* global PerformanceObserver */

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

if (typeof PerformanceObserver === 'function') {
  let observer = new PerformanceObserver(processList)
  observer.observe({entryTypes: ["measure"]})
} else {
  setInterval(() => {
    let entries = performance.getEntries({ entryType: 'measure' })
    processList(entries)
  }, 1000)
}

function observe(name) {
  return new Promise(resolve => {
    deferreds.set(name, resolve)
  })
}

export default observe