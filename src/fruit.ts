import { Observable } from 'rxjs';

export interface FruitInterface<O, B> {
  branch: B
  source_: Observable<O>
}

export type FruitConstructor<O, B> = new (branch: B) => FruitInterface<O, B>

export default abstract class Fruit<O, B> implements FruitInterface<O, B> {
  public branch: B
  public abstract source_: Observable<O>
  constructor (branch: B) {
    this.branch = branch
  }
}
