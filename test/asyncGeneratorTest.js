/* @flow */
import assert from 'power-assert'

async function asyncFn(n): Promise<number> {
  return Promise.resolve(n * 2);
}

async function* genFn(): AsyncGenerator<number, string, boolean> {
  yield 1
  return (yield await asyncFn(2)) ? 'hoge' : 'fuga'
}

describe('async generator', () => {
  it('returns "hoge" at the end', async () => {
    const g = genFn()
    let n = await g.next()
    assert(n.value === 1)
    assert(!n.done)
    n = await g.next()
    assert(n.value === 4)
    assert(!n.done)
    n = await g.next(true)
    assert(n.value === 'hoge')
    assert(n.done)
  })

  it('returns "fuga" at the end', async () => {
    const g = genFn()
    let n = await g.next()
    assert(n.value === 1)
    assert(!n.done)
    n = await g.next()
    assert(n.value === 4)
    assert(!n.done)
    n = await g.next(false)
    assert(n.value === 'fuga')
    assert(n.done)
  })
})

