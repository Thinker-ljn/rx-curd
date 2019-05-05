import TestTree from './test-tree';
import { Observable } from 'rxjs';

describe.only('branch curd', () => {
  const dl = new TestTree()
  const test_ = dl.tests.default_
  it('is Observable', () => {
    expect(test_).toBeInstanceOf(Observable)
  })

  it('curd', () => {
    const expects = [
      [],
      [{id: 1, name: 'name-1'}],
      [{id: 1, name: 'name-1'}, {id: 2, name: 'name-2'}],
      [{id: 2, name: 'name-2'}],
      [{id: 2, name: 'name-3'}]
    ]
    dl.tests.post({
      id: 1,
      name: 'name-1'
    })

    dl.tests.post({
      id: 2,
      name: 'name-2'
    })

    dl.tests.delete({
      id: 1
    })

    dl.tests.patch({
      id: 2,
      name: 'name-3'
    })
    let i = 0
    test_.subscribe((data) => {
      // console.log(data)
      expect(data).toMatchObject(expects[i++])
    })
  })
})
