import { BranchData } from './branch';

export interface KeyMap<T> {[key: string]: T}
export interface IndexMap<T> {[index: number]: T}
type FindIndex = <T extends BranchData>(prev: T[], curr: T) => number
type SingleFn = <T extends BranchData> (prev: T[], curr: T) => T[]

function fillPending<T extends BranchData> (origin: T, curr: T) {
  for (const key of (curr.__uk__ || [])) {
    Reflect.set(curr, key, Reflect.get(origin, key))
  }
}

function idValue <T>(data: Partial<T>, idKey: string) {
  if (!Reflect.has(data, idKey)) {
    return null
  }

  return Reflect.get(data, idKey)
}

function sameIdValue <T extends BranchData> (idKey: string, item: T, curr: T) {
  const itemIdValue = idValue(item, idKey)
  const currIdValue = idValue(curr, idKey)
  return itemIdValue !== null && currIdValue !== null && itemIdValue === currIdValue
}

const genFindIndex = (idKey: string) : FindIndex => {
  return function findIndex <T extends BranchData> (prev: T[], curr: T): number {
    return prev.findIndex(item => sameIdValue(idKey, item, curr))
  }
}

export const genSingleFn = (idKey: string, pending: boolean = false) => {
  const findIndexFn = genFindIndex(idKey)
  const singleUpdate: SingleFn = (prev, curr) => {
    const index = findIndexFn(prev, curr)
    if (index > -1) {
      if (pending) {
        fillPending(prev[index], curr)
      }
      prev.splice(index, 1, curr)
    } else {
      prev.push(curr)
    }
    return prev
  }

  const singleRemove: SingleFn = (prev, curr) => {
    const index = findIndexFn(prev, curr)
    if (index < 0) {
      return prev
    }
    if (curr.__status__) {
      if (pending) {
        fillPending(prev[index], curr)
      }
      prev.splice(index, 1, curr)
    } else {
      prev.splice(index, 1)
    }
    return prev
  }
  return {
    singleUpdate,
    singleRemove
  }
}

export const genCombineFn = (idKey: string, pending: boolean = false) => {
  const {singleUpdate, singleRemove} = genSingleFn(idKey, pending)
  return function combineLatestProject <T extends BranchData> (i: T[], c: T[], u: T[], r: T[]): T[] {
    c.forEach(d => singleUpdate(i, d))
    u.forEach(d => singleUpdate(i, d))
    r.forEach(d => singleRemove(i, d))
    return i
  }
}
