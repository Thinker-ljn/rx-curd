import { BranchConstructor } from './branch'
import DataCacheStore from './cache';
import Root from './root';
import Trunk from './trunk';
import TreeErrorHandler, { ErrorHandler } from './error';
import Http, {BaseHttp} from './http'
import { KeyMap } from './util';

export interface TreeOptions {
  http?: BaseHttp
  cache?: boolean
  errorHandler?: ErrorHandler
}

export default class Tree {
  public root: Root
  public trunk: Trunk
  public cache: DataCacheStore
  public errorHandler?: TreeErrorHandler
  private branchsRegistered: KeyMap<boolean> = {}
  private branchs: KeyMap<any> = {}
  public http: any
  constructor (options?: TreeOptions) {
    this.root = new Root(this)
    this.trunk = new Trunk(this.root)
    this.http = new Http(this)

    if (options) {
      if (options.http) {
        this.http = options.http
      }
      if (options.cache) {
        this.cache = new DataCacheStore(this.trunk)
      }
      if (options.errorHandler) {
        this.errorHandler = new TreeErrorHandler(this.trunk, options.errorHandler)
      }
    }
  }

  public registerBranch <T> (branchClass: BranchConstructor<T>) {
    const name = branchClass.name
    if (this.branchs[name]) {
      return this.branchs[name]
    }

    const branch = new branchClass(this.trunk)
    this.branchsRegistered[name] = true
    this.branchs[name] = branch
    if (this.cache) {
      this.cache.register(branch.namespace, branch.default_)
    }
    return branch
  }
}
