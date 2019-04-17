import { ReplaySubject, Observable } from 'rxjs';
import {  filter, merge } from 'rxjs/operators'
import Root, { RootSource } from './root'
import Tree from './tree';
import { ErrorPacket, Packet } from './http';

export type DLTrunkSource<T = any> = Observable<Packet<T>>
export type DLTrunkErrorSource = Observable<ErrorPacket>

export default class Trunk {
  public tree: Tree
  public root: Root
  public raw_: RootSource
  public source_: DLTrunkSource
  public error_: DLTrunkErrorSource
  private cache_: ReplaySubject<Packet> = new ReplaySubject()

  constructor (root: Root) {
    this.root = root
    this.tree = root.tree
    this.initSource()
  }

  public initSource () {
    this.raw_ = this.root.source_
    this.source_ = this.raw_.pipe(
      filter((packet: Packet) => packet.status === 200),
      merge(this.cache_),
    )

    this.error_ = this.raw_.pipe(
      filter((packet: ErrorPacket) => packet.status !== 200),
    )
  }

  public next <T> (data: Packet<T>) {
    this.cache_.next(data)
  }
}
