import now from './now'
import observe from './observe'
import { mark, measure } from './markMeasure'

let promises = new Map()
let lastName

class MarkyMark {

  start(name) {
    lastName = name
    let promise = observe(name)
    promises.set(name, promise)
    mark('start ' + name)
  }

  end(name) {
    name = name || lastName
    mark('end ' + name)
    measure(name, 'start ' + name, 'end ' + name)
    let promise = promises.get(name)
    promises.delete(name)
    return promise
  }

}

export default new MarkyMark()
