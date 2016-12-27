let assert = require('assert')
let markymark = process.env.NODE_ENV === 'development' ?
  require('../src/index').default : require('../')

describe('markymark', function () {
  this.timeout(30000)

  it('does a basic mark', function () {
    markymark.start('foo')
    return markymark.end().then(res => {
      assert(res)
      assert(typeof res === 'number')
      assert(res > 0)
    })
  })
})