import Tree from '../src/tree';

describe('tree instance', () => {
  it ('with empty option', () => {
    const tree = new Tree()
    expect(tree).toBeInstanceOf(Tree)
  })
})