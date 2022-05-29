import { textTable } from './textTable'

const firstSpace = /\n */g
const trim: typeof String.raw = (...args) => {
  let s = String.raw(...args).trimEnd()
  const match = s.match(firstSpace)
  if (match) {
    const minMatch = match.reduce((min, s) => (s.length < min.length ? s : min), match[0])
    s = s.replaceAll(minMatch, '\n')
  }
  return s.substring(1) + '\n'
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

  const data3 = [
    ['Apples', 37.5, 33.13],
    ['Bananas', 4.246, 4.09],
    ['Tangerines', 58.254, 45.34],
  ]

  it('should only print header if data table is empty', () => {
    expect(textTable([], ['Fruits', 'Max', 'Avg'])).toEqual(trim`
      Fruits | Max | Avg
      -------|-----|----                        
    `)
  })

  it('should format three columns', () => {
    expect(textTable(data3, ['Fruits', 'Max', 'Avg'])).toEqual(trim`
      Fruits     |   Max |   Avg
      -----------|-------|------
      Apples     | 37.50 | 33.13
      Bananas    |  4.25 |  4.09
      Tangerines | 58.25 | 45.34
    `)
  })

  it('should omit first column ', () => {
    expect(textTable(data3, [, 'Max', 'Avg'])).toEqual(trim`
        Max |   Avg
      ------|------
      37.50 | 33.13
       4.25 |  4.09
      58.25 | 45.34
    `)
  })

  it('should omit column header', () => {
    expect(textTable(data3, ['Fruits', 'Max'])).toEqual(trim`
      Fruits     |   Max
      -----------|------
      Apples     | 37.50
      Bananas    |  4.25
      Tangerines | 58.25
    `)
  })
})
