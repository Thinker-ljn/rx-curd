import { BranchData } from './branch';

export interface KeyMap<T> {[key: string]: T}
export interface IndexMap<T> {[index: number]: T}

type SingleFn = <T extends BranchData> (prev: T[], curr: T) => T[]

function findIndex<T extends BranchData> (prev: T[], curr: T): number {
  return prev.findIndex(item => item.id === curr.id || item.__key__ === curr.__key__)
}
function fillPending<T extends BranchData> (origin: T, curr: T) {
  for (const key of (curr.__uk__ || [])) {
    Reflect.set(curr, key, Reflect.get(origin, key))
  }
}
export const singleUpdate: SingleFn = (prev, curr) => {
  const index = findIndex(prev, curr)
  if (index > -1) {
    fillPending(prev[index], curr)
    prev.splice(index, 1, curr)
  } else {
    prev.push(curr)
  }
  return prev
}

export const singleRemove: SingleFn = (prev, curr) => {
  const index = findIndex(prev, curr)
  if (index > -1) {
    if (curr.__status__) {
      fillPending(prev[index], curr)
      prev.splice(index, 1, curr)
    } else {
      prev.splice(index, 1)
    }
   }
  return prev
}

export const combineLatestProject = <T extends BranchData>(i: T[], c: T[], u: T[], r: T[]): T[] => {
  c.forEach(d => singleUpdate(i, d))
  u.forEach(d => singleUpdate(i, d))
  r.forEach(d => singleRemove(i, d))
  return i
}
