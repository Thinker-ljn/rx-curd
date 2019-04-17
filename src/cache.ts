import { Observable } from 'rxjs';
import Trunk from './trunk';
import { BaseData } from './branch';
import { Packet } from './http';

type StoreType = 'localStorage' | 'sessionStorage'
interface Options {
  prefix?: string
  type?: StoreType
}
export default class DataCacheStore  {
  private prefix = 'dcs_'
  private registerKeys: string[] = []
  private type: StoreType = 'localStorage'
  private trunk: Trunk
  constructor (trunk: Trunk, options: Options = {}) {
    this.init(options)
    this.trunk = trunk
  }

  private init (options: Options) {
    if (options.prefix) {
      this.prefix = options.prefix
    }
    if (options.type) {
      this.type = options.type
    }
  }

  get store () {
    return window[this.type]
  }

  public register <T> (namespace: string, source_: Observable<T[]>) {
    this.registerKeys.push(namespace)
    source_.subscribe((data: T[]) => {
      this.put(namespace, data)
    })
  }

  private k (key: string) {
    return this.prefix + key
  }

  private v (value: any) {
    return JSON.stringify(value)
  }

  private r <T> (value: string): T[] {
    return JSON.parse(value)
  }

  public put <T extends BaseData> (namespace: string, data: T[]) {
    data = data.filter(d => d.__status__ === void 0)
    if (!data.length) {
      return
    }
    this.store.setItem(this.k(namespace), this.v(data))
  }

  public match <T> (namespace: string): boolean {
    const data = this.r<T>(this.store.getItem(this.k(namespace)) || '[]')
    const packet: Packet = {
      namespace,
      api: namespace,
      data,
      method: 'get',
      status: 200,
    }
    if (data.length) {
      this.trunk.next(packet)
    }

    return !!data.length
  }

  public clearRegister () {
    this.registerKeys.forEach(key => {
      this.store.removeItem(this.k(key))
    })
  }

  public clear () {
    this.store.clear()
  }
}
