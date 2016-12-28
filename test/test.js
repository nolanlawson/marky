/* global it, describe */

let assert = require('assert')
let marky = process.env.NODE_ENV === 'development' ? require('../src/index') : require('../')
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

describe('marky', function () {
  this.timeout(30000)

  it('does a basic mark', () => {
    marky.start('foo')
    var res = marky.end()
    assert(typeof res.duration === 'number')
    assertGte(res.duration, 0)
  })

  it('does a basic mark with end defined', () => {
    marky.start('bar')
    var res = marky.end('bar')
    assert(typeof res.duration === 'number')
    assertGte(res.duration, 0)
  })

  it('does a basic mark with an entry result', () => {
    marky.start('bar')
    var res = marky.end('bar')
    assert(typeof res.duration === 'number')
    assert.equal(res.entryType, 'measure')
    assert.equal(res.name, 'bar')
    assert(typeof res.startTime === 'number')
  })

  it('throws errors on unknown marks', () => {
    marky.start('toto')
    return Promise.resolve().then(() => {
      return marky.end('lala')
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('throws errors on empty mark starts', () => {
    return Promise.resolve().then(() => {
      return marky.start()
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('throws errors on empty mark ends', () => {
    return Promise.resolve().then(() => {
      return marky.end()
    }).then(() => {
      throw new Error('expected an error here')
    }, err => {
      assert(err)
    })
  })

  it('records reasonable times', () => {
    marky.start('baz')
    return sleep(1000).then(() => {
      return marky.end()
    }).then(res => {
      assertBetween(res.duration, 950, 2000)
    })
  })

  it('can re-use measurement names', () => {
    marky.start('foobar')
    return sleep(500).then(() => {
      return marky.end()
    }).then(res1 => {
      marky.start('foobar')
      return sleep(1500).then(() => {
        return marky.end()
      }).then(res2 => {
        assertBetween(res1.duration, 450, 1400)
        assertBetween(res2.duration, 1450, 2400)
      })
    })
  })

  it('can measure two directly subsequent measurements', () => {
    marky.start('thing number one')
    return sleep(500).then(() => {
      var res1 = marky.end()
      marky.start('thing numero dos')
      return sleep(1500).then(() => {
        return marky.end()
      }).then(res2 => {
        assertBetween(res1.duration, 450, 1400)
        assertBetween(res2.duration, 1450, 2400)
      })
    })
  })

  it('can do many measurements in parallel', () => {
    marky.start('turtles')
    return Promise.all([
      sleep(5).then(() => marky.start('leonardo')),
      sleep(10).then(() => marky.start('michelangelo')),
      sleep(15).then(() => marky.start('donatello')),
      sleep(20).then(() => marky.start('raphael'))
    ]).then(() => {
      return Promise.all([
        sleep(500).then(() => marky.end('leonardo')),
        sleep(1000).then(() => marky.end('michelangelo')),
        sleep(1500).then(() => marky.end('donatello')),
        sleep(2000).then(() => marky.end('raphael'))
      ])
    }).then(res => {
      var total = marky.end('turtles')
      assertBetween(res[0].duration, 400, 1100)
      assertBetween(res[1].duration, 900, 1600)
      assertBetween(res[2].duration, 1400, 2100)
      assertBetween(res[3].duration, 1900, 2700)
      assertBetween(total.duration, 1900, 5000)
    })
  })
})
