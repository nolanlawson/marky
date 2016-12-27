/* global performance */

let now

if (typeof performance !== 'undefined' && performance.now) {
  now = performance.now
} else {
  now = Date.now
}

export default now
