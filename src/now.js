// implementation borrowed from:
// https://github.com/myrne/performance-now/blob/6223a0d544bae1d5578dd7431f78b4ec7d65b15c/src/performance-now.coffee
const loadTime = getNanoSeconds()
const hrtime = require('process').hrtime

function now() {
  return getNanoSeconds() - loadTime / 1e6
}

function getNanoSeconds() {
  const hr = hrtime()
  return hr[0] * 1e9 + hr[1]
}

export default now;