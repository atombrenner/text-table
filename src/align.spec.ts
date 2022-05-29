import { alignLeft, alignRight } from './textTable'

describe('align', () => {
  it('alignLeft should align string to the left in given width', () => {
    expect(alignLeft('some', 5)).toEqual('some ')
    expect(alignLeft('some', 7)).toEqual('some   ')
  })
  it('alignLeft will not limit too long string for too small width', () => {
    expect(alignLeft('some', 1)).toEqual('some')
  })

  it('alignRight should align string to the right in given width', () => {
    expect(alignRight('some', 5)).toEqual(' some')
    expect(alignRight('some', 7)).toEqual('   some')
  })
  it('alignRight will not limit too long string for too small width', () => {
    expect(alignRight('some', 1)).toEqual('some')
  })
})
