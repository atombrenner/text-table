import { alignLeft, alignRight } from './textTable'

describe('align', () => {
  it('alignLeft should align string to the left in given width', () => {
    expect(alignLeft('some', 5)).toEqual('some ')
    expect(alignLeft('some', 7)).toEqual('some   ')
  })
  it('alignLeft should replace too long string with ellipsis on the right', () => {
    expect(alignLeft('some', 2)).toEqual('s…')
  })

  it('alignRight should align string to the right in given width', () => {
    expect(alignRight('1.23', 5)).toEqual(' 1.23')
    expect(alignRight('1.23', 7)).toEqual('   1.23')
  })
  it('alignRight should replace too long string with ellipsis on the left', () => {
    expect(alignRight('1.23', 2)).toEqual('…3')
  })
})
