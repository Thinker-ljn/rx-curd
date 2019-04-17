import Tree from './tree';
import Trunk from './trunk';
import { ErrorPacket } from './http';

export type ErrorHandler = (value: ErrorPacket) => void
export default class TreeErrorHandler {
  public tree: Tree
  public trunk: Trunk

  constructor (trunk: Trunk, handler?: ErrorHandler) {
    this.trunk = trunk
    this.tree = trunk.tree

    if (handler) {
      this.trunk.error_.subscribe(handler)
    }
  }
}
