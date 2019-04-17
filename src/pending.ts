import { Observable, Subject } from 'rxjs';
import { map, merge, scan } from 'rxjs/operators';
import { BranchData } from './branch';

export type PendingStatus = 'creating' | 'updating' | 'deleting'
interface PenddingSources<T> {[key: string]: Subject<T>}

interface Dict<T> {[key: string]: T}
type Accumulator<T> = (acc: Dict<T>, curr: T) => Dict<T>
export type MergeFn<T> = (source_: Observable<T>, pending_?: Subject<T>) => Observable<T[]>
export default class Pendding<T extends BranchData> {
  public static CREATE: PendingStatus = 'creating'
  public static UPDATE: PendingStatus = 'updating'
  public static DELETE: PendingStatus = 'deleting'
  public uid: number = 0
  public sources: PenddingSources<T> = {
    creating_: new Subject(),
    updating_: new Subject(),
    deleting_: new Subject(),
  }

  public getUniqueKey (data: T) {
    const currId = ++this.uid
    if (!data.id) { data.id = -currId }

    data.__key__ = data.id + '-' + currId
    return data.__key__
  }

  public push (data: T, status: PendingStatus = 'creating'): any {
    const pendingData = {...data}
    const __key__  = this.getUniqueKey(pendingData)
    pendingData.__status__ = status

    const config = {params: {__key__}}

    this.sources[status + '_'].next(pendingData)

    return config
  }

  private merge (source_: Observable<T>, pending_: Subject<T>, scanFn: Accumulator<T>) {
    return pending_.pipe(
      merge(source_),
      scan((acc: Dict<T>, curr: T): Dict<T> => {
        return scanFn(acc, curr)
      }, {}),
      map((dict: Dict<T>) => Object.keys(dict).map(key => dict[key])),
    )
  }

  public mergeCreate: MergeFn<T> = (source_) => {
    const scanFn: Accumulator<T> = (acc, curr) => {
      const exist = acc[curr.__key__]
      if (!exist || !curr.__status__ || curr.id > exist.id) {
        acc[curr.__key__] = curr
      }
      return acc
    }
    return this.merge(source_, this.sources.creating_, scanFn)
  }

  public mergeUpdate: MergeFn<T> = (source_, pending_) => {
    const scanFn: Accumulator<T> = (acc, curr) => {
      const exist = acc[curr.id]
      if (!exist || !curr.__status__) {
        acc[curr.__key__] = curr
      }
      return acc
    }
    if (!pending_) { pending_ = this.sources.updating_ }
    return this.merge(source_, pending_, scanFn)
  }

  public mergeDelete: MergeFn<T> = (source_) => {
    return this.mergeUpdate(source_, this.sources.deleting_)
  }
}
