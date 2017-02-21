/* @flow */
import assert from 'power-assert'

async function asyncFn(n: number): Promise<number> {
  return Promise.resolve(n * 2);
}

async function* genFn(n: number): AsyncGenerator<number, string, boolean> {
  yield 1
  return (yield await asyncFn(n)) ? 'hoge' : 'fuga'
}

async function genFn2(n: number): Promise<AsyncGenerator<number, string, boolean>> {
  return genFn(await asyncFn(1));
}

describe('async generator', () => {
  it('returns "hoge" at the end', async () => {
    const g = genFn(2)
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
    const g = genFn(2)
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

  it('calls function that returns new generator', async () => {
    const g = await genFn2(2)
    let n = await g.next()
    assert(n.value === 1)
    assert(!n.done)
    n = await g.next()
    assert(n.value === 4)
    assert(!n.done)
    n = await g.next()
    assert(n.value === 'fuga')
    assert(n.done)
  });
})

