/* global it, describe */

let assert = require('assert')
let marky = process.env.NODE_ENV === 'development' ? require('../src/index') : require('../')
let Promise = require('native-or-lie')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function assertGt (num1, num2) {
  num1 = Math.round(num1)
  num2 = Math.round(num2)
  assert(num1 > num2, `failed: ${num1} > ${num2}`)
}

function assertGte (num1, num2) {
  num1 = Math.round(num1)
  num2 = Math.round(num2)
  assert(num1 >= num2, `failed: ${num1} >= ${num2}`)
}

function assertLte (num1, num2) {
  num1 = Math.round(num1)
  num2 = Math.round(num2)
  assert(num1 <= num2, `failed: ${num1} <= ${num2}`)
}

function assertBetween (num, num1, num2) {
  assertGte(num, num1)
  assertLte(num, num2)
}

describe('marky', function () {
  this.timeout(30000)

  it('does a basic mark with end defined', () => {
    marky.mark('bar')
    var res = marky.stop('bar')
    assert(typeof res.duration === 'number')
    assertGte(res.duration, 0)
  })

  it('does a basic mark with an entry result', () => {
    marky.mark('bar')
    var res = marky.stop('bar')
    assert(typeof res.duration === 'number')
    assert.equal(res.entryType, 'measure')
    assert.equal(res.name, 'bar')
    assert(typeof res.startTime === 'number')
  })

  it('throws errors on unknown marks', () => {
    marky.mark('toto')
    return Promise.resolve().then(() => {
      return marky.stop('lala')
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('throws errors on empty mark starts', () => {
    return Promise.resolve().then(() => {
      return marky.mark()
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('throws errors on empty mark ends', () => {
    return Promise.resolve().then(() => {
      return marky.stop()
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('records reasonable times', () => {
    marky.mark('baz')
    return sleep(1000).then(() => {
      return marky.stop('baz')
    }).then(res => {
      assertBetween(res.duration, 950, 2000)
    })
  })

  it('can re-use measurement names', () => {
    marky.mark('foobar')
    return sleep(500).then(() => {
      return marky.stop('foobar')
    }).then(res1 => {
      marky.mark('foobar')
      return sleep(1500).then(() => {
        return marky.stop('foobar')
      }).then(res2 => {
        assertBetween(res1.duration, 450, 1400)
        assertBetween(res2.duration, 1450, 2400)
        assertGt(res2.startTime, res1.startTime)
      })
    })
  })

  it('can measure two interleaved measurements', () => {
    marky.mark('ichi')
    return sleep(500).then(() => {
      marky.mark('ni')
      return sleep(500)
    }).then(() => {
      var res1 = marky.stop('ichi')
      return sleep(1000).then(() => {
        return marky.stop('ni')
      }).then(res2 => {
        assertBetween(res1.duration, 900, 1400)
        assertBetween(res2.duration, 1450, 2000)
        assertGt(res2.startTime, res1.startTime)
      })
    })
  })

  it('can measure two directly subsequent measurements', () => {
    marky.mark('thing number one')
    return sleep(500).then(() => {
      var res1 = marky.stop('thing number one')
      marky.mark('thing numero dos')
      return sleep(1500).then(() => {
        return marky.stop('thing numero dos')
      }).then(res2 => {
        assertBetween(res1.duration, 450, 1400)
        assertBetween(res2.duration, 1450, 2400)
        assertGt(res2.startTime, res1.startTime)
      })
    })
  })

  it('can do many measurements in parallel', () => {
    marky.mark('turtles')
    return Promise.all([
      sleep(5).then(() => marky.mark('leonardo')),
      sleep(10).then(() => marky.mark('michelangelo')),
      sleep(15).then(() => marky.mark('donatello')),
      sleep(20).then(() => marky.mark('raphael'))
    ]).then(() => {
      return Promise.all([
        sleep(500).then(() => marky.stop('leonardo')),
        sleep(1000).then(() => marky.stop('michelangelo')),
        sleep(1500).then(() => marky.stop('donatello')),
        sleep(2000).then(() => marky.stop('raphael'))
      ])
    }).then(res => {
      var total = marky.stop('turtles')
      assertBetween(res[0].duration, 400, 1100)
      assertBetween(res[1].duration, 900, 1600)
      assertBetween(res[2].duration, 1400, 2100)
      assertBetween(res[3].duration, 1900, 2700)
      assertBetween(total.duration, 1900, 5000)
    })
  })
})
