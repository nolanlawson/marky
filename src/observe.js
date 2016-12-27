/* global PerformanceObserver */

const watchingNames = []
const deferreds = {}

function processList(entries) {
  for (let i = 0, len = entries.length; i < len; i++) {
    const entry = entries[i]
    if (~watchingNames.indexOf(entry.name)) {
      var deferred = deferreds['$' + entry.name]
      if (deferred) {
        delete deferreds['$' + entry.name]
        deferred(entry.duration)
      }
    }
  }
}

if (typeof PerformanceObserver === 'function') {
  const observer = new PerformanceObserver(processList)
  observer.observe({entryTypes: ["measure"]})
} else {
  setInterval(() => {
    const entries = performance.getEntries({ entryType: 'measure' })
    processList(entries)
  }, 1000)
}

function observe(name) {
  const promise = new Promise(resolve => {
    deferreds['$' + name] = resolve
  })
  watchingNames.push(name)
  return promise
}

export default observe