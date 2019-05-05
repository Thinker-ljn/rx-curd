import Tree from '@/src/tree';
import TestBranch from './test-branch';

export default class TestTree extends Tree {
  public readonly tests = this.registerBranch(TestBranch) as TestBranch
}
