/* @flow */
import assert from 'power-assert'

function* genFn(): Generator<number, string, boolean> {
  return (yield 1) ? 'hoge' : 'fuga'
}

function genFn2(): Generator<number, string, boolean> {
  return genFn();
}

describe('generator', () => {
  it('returns "hoge" at the end', () => {
    const g = genFn()
    let n = g.next()
    assert(n.value === 1)
    assert(!n.done)
    n = g.next(true)
    assert(n.value === 'hoge')
    assert(n.done)
  })

  it('returns "fuga" at the end', () => {
    const g = genFn()
    let n = g.next()
    assert(n.value === 1)
    assert(!n.done)
    n = g.next(false)
    assert(n.value === 'fuga')
    assert(n.done)
  })

  it('calls function that returns new generator', () => {
    const g = genFn2()
    let n = g.next()
    assert(n.value === 1)
    assert(!n.done)
    n = g.next()
    assert(n.value === 'fuga')
    assert(n.done)
  });
})
