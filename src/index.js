import { observe } from './observer'
import { mark, measure } from './markMeasure'

let promises = new Map()
let lastName

function start (name) {
  lastName = name
  let promise = observe(name)
  promises.set(name, promise)
  mark('start ' + name)
}

function end (name) {
  name = name || lastName
  mark('end ' + name)
  measure(name, 'start ' + name, 'end ' + name)
  let promise = promises.get(name)
  promises.delete(name)
  return promise
}

export { start, end }
