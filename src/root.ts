import { ReplaySubject } from 'rxjs'
import Tree from './tree';
import { Packet, ErrorPacket } from './http';

export type RootSource = ReplaySubject<Packet | ErrorPacket>

class Root {
  public tree: Tree
  public source_: RootSource

  constructor (tree: Tree) {
    this.tree = tree
    this.source_ = new ReplaySubject()
  }

  public next (payload: Packet | ErrorPacket) {
    // if (params && params.__key__) { packet.__key__ = params.__key__ }
    this.source_.next(payload)
  }
}

export default Root
