/* global it, describe */

let assert = require('assert')
let markymark = process.env.NODE_ENV === 'development' ? require('../src/index') : require('../')
let Promise = require('native-or-lie')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
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

describe('markymark', function () {
  this.timeout(30000)

  it('does a basic mark', () => {
    markymark.start('foo')
    var res = markymark.end()
    assert(typeof res.duration === 'number')
    assertGte(res.duration, 0)
  })

  it('does a basic mark with end defined', () => {
    markymark.start('bar')
    var res = markymark.end('bar')
    assert(typeof res.duration === 'number')
    assertGte(res.duration, 0)
  })

  it('does a basic mark with an entry result', () => {
    markymark.start('bar')
    var res = markymark.end('bar')
    assert(typeof res.duration === 'number')
    assert.equal(res.entryType, 'measure')
    assert.equal(res.name, 'bar')
    assert(typeof res.startTime === 'number')
  })

  it('throws errors on unknown marks', () => {
    markymark.start('toto')
    return Promise.resolve().then(() => {
      return markymark.end('lala')
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('throws errors on empty mark starts', () => {
    return Promise.resolve().then(() => {
      return markymark.start()
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('throws errors on empty mark ends', () => {
    return Promise.resolve().then(() => {
      return markymark.end()
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('records reasonable times', () => {
    markymark.start('baz')
    return sleep(1000).then(() => {
      return markymark.end()
    }).then(res => {
      assertBetween(res.duration, 950, 2000)
    })
  })

  it('can re-use measurement names', () => {
    markymark.start('foobar')
    return sleep(500).then(() => {
      return markymark.end()
    }).then(res1 => {
      markymark.start('foobar')
      return sleep(1500).then(() => {
        return markymark.end()
      }).then(res2 => {
        assertBetween(res1.duration, 450, 1400)
        assertBetween(res2.duration, 1450, 2400)
      })
    })
  })

  it('can measure two directly subsequent measurements', () => {
    markymark.start('thing number one')
    return sleep(500).then(() => {
      var res1 = markymark.end()
      markymark.start('thing numero dos')
      return sleep(1500).then(() => {
        return markymark.end()
      }).then(res2 => {
        assertBetween(res1.duration, 450, 1400)
        assertBetween(res2.duration, 1450, 2400)
      })
    })
  })

  it('can do many measurements in parallel', () => {
    markymark.start('turtles')
    return Promise.all([
      sleep(5).then(() => markymark.start('leonardo')),
      sleep(10).then(() => markymark.start('michelangelo')),
      sleep(15).then(() => markymark.start('donatello')),
      sleep(20).then(() => markymark.start('raphael'))
    ]).then(() => {
      return Promise.all([
        sleep(500).then(() => markymark.end('leonardo')),
        sleep(1000).then(() => markymark.end('michelangelo')),
        sleep(1500).then(() => markymark.end('donatello')),
        sleep(2000).then(() => markymark.end('raphael'))
      ])
    }).then(res => {
      var total = markymark.end('turtles')
      assertBetween(res[0].duration, 400, 1100)
      assertBetween(res[1].duration, 900, 1600)
      assertBetween(res[2].duration, 1400, 2100)
      assertBetween(res[3].duration, 1900, 2700)
      assertBetween(total.duration, 1900, 5000)
    })
  })
})
