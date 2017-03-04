/* global it, describe, performance */

var assert = require('assert')
var marky = process.env.NODE_ENV === 'development' ? require('../src/index') : require('../')
var Promise = require('native-or-lie')

if (typeof performance !== 'undefined' && performance.setResourceTimingBufferSize) {
  performance.setResourceTimingBufferSize(10000) // increase firefox's default limit
}

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

  it('collects entries ordered by startTime', () => {
    marky.mark('charmander')
    return sleep(50)
      .then(() => marky.mark('squirtle'))
      .then(() => sleep(50))
      .then(() => marky.mark('bulbasaur'))
      .then(() => sleep(200))
      .then(() => {
        marky.stop('bulbasaur')
        marky.stop('squirtle')
        marky.stop('charmander')
        var entries = marky.getEntries()
        assert.deepEqual(
        entries.map(x => x.name),
        ['charmander', 'squirtle', 'bulbasaur']
      )
        entries.forEach(entry => {
          assert(typeof entry.startTime === 'number')
          assert(typeof entry.duration === 'number')
          assert.equal(entry.entryType, 'measure')
        })
      })
  })

  it('collects entries ordered by startTime 2', () => {
    marky.mark('pikachu')
    return sleep(50).then(() => marky.mark('pidgey'))
      .then(() => sleep(50)).then(() => marky.mark('jigglypuff'))
      .then(() => sleep(200)).then(() => {
        marky.stop('pidgey')
        marky.stop('pikachu')
        marky.stop('jigglypuff')
        var entries = marky.getEntries()
        assert.deepEqual(entries.map(x => x.name), [
          'charmander', 'squirtle', 'bulbasaur',
          'pikachu', 'pidgey', 'jigglypuff'
        ])
        entries.forEach(entry => {
          assert(typeof entry.startTime === 'number')
          assert(typeof entry.duration === 'number')
          assert.equal(entry.entryType, 'measure')
        })
      })
  })

  it('clears measures (entries)', () => {
    marky.mark('pikachu')
    marky.mark('pidgey')
    marky.mark('pikachu')
    marky.stop('pikachu')
    marky.stop('pidgey')
    marky.stop('pikachu')

    marky.clearMeasures()
    assert.equal(marky.getEntries().length, 0)
  })

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
