import Branch, { BranchData } from '@/src/branch';

export interface DLTest extends BranchData {
  id: number,
  name: string
}
export default class TestBranch extends Branch<DLTest> {
  public exampleData = {
    id: 0,
    __key__: '',
    name: ''
  }
}