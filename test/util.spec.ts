import { genSingleFn, genCombineFn } from '../src/util';
import { BranchData } from '../src/branch';

interface Data extends BranchData {
  id: number
}
const {singleRemove, singleUpdate} = genSingleFn('id')
const combineLatestProject = genCombineFn('id')
describe('util test', () => {
  let prev: Data[] = []
  const c: Data = {id: 0, __key__: '0'}
  const u: Data = {id: 0, __key__: '1'}
  const r: Data = {id: 0, __key__: '1'}

  it('create', () => {
    prev = singleUpdate(prev, c)
    expect(prev).toMatchObject([{id: 0, __key__: '0'}])
  })

  it('update', () => {
    prev = singleUpdate(prev, u)
    expect(prev).toMatchObject([{id: 0, __key__: '1'}])
  })

  it('delete', () => {
    prev = singleRemove(prev, r)
    expect(prev).toMatchObject([])
  })

  it('combine', () => {
    const c2: Data = {id: 1, __key__: '2'}
    const u2: Data = {id: 0, __key__: '3'}
    prev = combineLatestProject(prev, [c, c2], [u, u2], [r])
    expect(prev).toMatchObject([{id: 1, __key__: '2'}])
  })
})
