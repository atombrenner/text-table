import { textTable } from './textTable'

const firstSpace = /\n */
const trim: typeof String.raw = (...args) => {
  let s = String.raw(...args)
  const match = s.match(firstSpace)
  if (match) s = s.replaceAll(match[0], '\n')
  return s.trim() + '\n'
}

describe('textTable', () => {
  it('should return empty line for no data', () => {
    expect(textTable([])).toEqual('\n')
  })

  it('should return one row per entry', () => {
    const data = [[1], [2], [3]]
    expect(textTable(data)).toEqual('1.00\n2.00\n3.00\n')
  })

  const data = [
    ['Apples', 37.5],
    ['Bananas', 4.246],
    ['Tangerines', 58.254],
  ]

  it('should format without header', () => {
    expect(textTable(data)).toEqual(trim`
      Apples     | 37.50
      Bananas    |  4.25
      Tangerines | 58.25
    `)
  })

  it('should format with header', () => {
    expect(textTable(data, ['Fruits', 'Percentage'])).toEqual(trim`
      Fruits     | Percentage
      -----------|-----------
      Apples     |      37.50
      Bananas    |       4.25
      Tangerines |      58.25
    `)
  })
})
