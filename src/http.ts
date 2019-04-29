import Tree from './tree';
import Root from './root';

type Method = 'get' | 'post' | 'patch' | 'delete'
interface BasePacket {
  namespace: string,
  api: string,
  method: Method,
  status: number,
  __key__?: string
}

export interface ErrorPacket extends BasePacket {
  error: Error
}

export interface Packet<T = any> extends BasePacket {
  data: T
}
interface RequestConfig {
  url?: string;
  method?: Method;
  data: any;
}
export interface BaseHttp {
  request: <C extends RequestConfig>(config: C) => any
}
export default class Http implements BaseHttp {
  public tree: Tree;
  public root: Root
  constructor (tree: Tree) {
    this.tree = tree
    this.root = tree.root
  }

  private prase <T>(api: string, method: Method, data?: T) {
    const namespace = api.replace(/([^\/\?]+)([\/\?\#\:]?.*)/, '$1')
    const packet: Packet = {
      namespace,
      api,
      data: data || [],
      method,
      status: 200,
    }
    return packet
  } 

  public request <C extends RequestConfig>(config: C) {
    const {url, method, data} = config
    const response = Promise.resolve(this.prase(url || '', method || 'get', data))
    response.then(res => this.root.next(res))
    return response
  }
}
