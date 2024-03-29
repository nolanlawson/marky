import perf from './performance'

let nowPolyfillForNode

if (!process.browser) {
  // implementation borrowed from:
  // https://github.com/myrne/performance-now/blob/6223a0d544bae1d5578dd7431f78b4ec7d65b15c/src/performance-now.coffee
  const hrtime = process.hrtime
  const getNanoSeconds = () => {
    const hr = hrtime()
    return hr[0] * 1e9 + hr[1]
  }
  const loadTime = getNanoSeconds()
  nowPolyfillForNode = () => ((getNanoSeconds() - loadTime) / 1e6)
}

export default perf && perf.now
  ? () => perf.now()
  : process.browser ? () => Date.now() : nowPolyfillForNode
