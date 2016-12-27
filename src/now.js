/* global performance */

import nowHrtime from './nowHrtime'

let now

if (process.browser) {
  if (typeof performance !== 'undefined' && performance.now) {
    now = () => performance.now()
  } else {
    now = () => Date.now()
  }
} else {
  now = nowHrtime
}
export default now
