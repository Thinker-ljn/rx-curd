import Tree from './tree';

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

// type Response = Promise<Packet | ErrorPacket>
// export abstract class baseHttp {
//   public get: (api: string) => Response
//   public post: <T>(api: string, data: T) => Response
//   public patch: <T>(api: string, data: T) => Response
//   public delete: <T>(api: string, data: T) => Response

// } 
export default class Http {
  tree: Tree;
  constructor (tree: Tree) {
    this.tree = tree
  }

  private prase <T>(api: string, method: Method, data?: T) {
    const namespace = api.replace(/([^\/\?]+)([\/\?\#\:]?.*)/, '$1')
    const packet: Packet = {
      namespace,
      api,
      data: data || [],
      method: method,
      status: 200,
    }
    return packet
  }

  public get (api: string) {
    return Promise.resolve(this.prase(api, 'get'))
  } 
  
  public post <T>(api: string, data: T) {
    return Promise.resolve(this.prase(api, 'post', data))
  }

  public patch <T>(api: string, data: T) {
    return Promise.resolve(this.prase(api, 'patch', data))
  }

  public delete <T>(api: string, data: T) {
    return Promise.resolve(this.prase(api, 'delete', data))
  }
}
