import { singleUpdate, singleRemove, combineLatestProject } from '../src/util';
import { BranchData } from '../src/branch';

describe('util test', () => {
  let prev: BranchData[] = []
  const c: BranchData = {id: 0, __key__: '0'}
  const u: BranchData = {id: 0, __key__: '1'}
  const r: BranchData = {id: 0, __key__: '1'}

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
    const c2: BranchData = {id: 1, __key__: '2'}
    const u2: BranchData = {id: 0, __key__: '3'}
    prev = combineLatestProject(prev, [c, c2], [u, u2], [r])
    expect(prev).toMatchObject([{id: 1, __key__: '2'}])
  })
})
