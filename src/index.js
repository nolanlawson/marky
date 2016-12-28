import { mark, measure } from './markMeasure'

let lastName

function start (name) {
  lastName = name

  if (!name) {
    throw new Error('name must be non-empty')
  }

  mark('start ' + name)
}

function end (name) {
  name = name || lastName

  if (!name) {
    throw new Error('name must be non-empty')
  }

  mark('end ' + name)
  return measure(name, 'start ' + name, 'end ' + name)
}

export { start, end }
