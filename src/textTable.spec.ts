import { textTable, lightLineTheme, heavyLineTheme, doubleLineTheme } from './textTable'

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
    const text = textTable(data)
    expect(text).toEqual(trim`
      Apples     | 37.50
      Bananas    |  4.25
      Tangerines | 58.25
    `)
  })

  it('should format with header', () => {
    const text = textTable(data, ['Fruits', 'Percentage'])
    expect(text).toEqual(trim`
      Fruits     | Percentage
      -----------|-----------
      Apples     |      37.50
      Bananas    |       4.25
      Tangerines |      58.25
    `)
  })

  const header3 = ['Fruits', 'Max', 'Avg']
  const data3 = [
    ['Apples', 37.5, 33.13],
    ['Bananas', 4.246, 4.09],
    ['Tangerines', 58.254, 45.34],
  ]
  const data3WithFooter = [...data3, ['Sum', 100, 34.030001]]

  it('should print header only if data is empty', () => {
    const text = textTable([], header3)
    expect(text).toEqual(trim`
      Fruits | Max | Avg
      -------|-----|----                        
    `)
  })

  it('should format three columns', () => {
    const text = textTable(data3, header3)
    expect(text).toEqual(trim`
      Fruits     |   Max |   Avg
      -----------|-------|------
      Apples     | 37.50 | 33.13
      Bananas    |  4.25 |  4.09
      Tangerines | 58.25 | 45.34
    `)
  })

  it('should omit first column ', () => {
    const text = textTable(data3, [, 'Max', 'Avg'])
    expect(text).toEqual(trim`
        Max |   Avg
      ------|------
      37.50 | 33.13
       4.25 |  4.09
      58.25 | 45.34
    `)
  })

  it('should omit second column ', () => {
    const text = textTable(data3, ['Fruits', , 'Avg'])
    expect(text).toEqual(trim`
      Fruits     |   Avg
      -----------|------
      Apples     | 33.13
      Bananas    |  4.09
      Tangerines | 45.34
    `)
  })

  it('should omit last column', () => {
    const text = textTable(data3, ['Fruits', 'Max'])
    expect(text).toEqual(trim`
      Fruits     |   Max
      -----------|------
      Apples     | 37.50
      Bananas    |  4.25
      Tangerines | 58.25
    `)
  })

  it('should render a footer', () => {
    const text = textTable(data3WithFooter, header3, { footer: true })
    expect(text).toEqual(trim`
      Fruits     |    Max |   Avg
      -----------|--------|------
      Apples     |  37.50 | 33.13
      Bananas    |   4.25 |  4.09
      Tangerines |  58.25 | 45.34
      -----------|--------|------
      Sum        | 100.00 | 34.03
    `)
  })

  it('should render a border', () => {
    const text = textTable(data3WithFooter, header3, { footer: true, border: true })
    expect(text).toEqual(trim`
      |------------|--------|-------|
      | Fruits     |    Max |   Avg |
      |------------|--------|-------|
      | Apples     |  37.50 | 33.13 |
      | Bananas    |   4.25 |  4.09 |
      | Tangerines |  58.25 | 45.34 |
      |------------|--------|-------|
      | Sum        | 100.00 | 34.03 |
      |------------|--------|-------|
     `)
  })

  it('should render a lightLineTheme border', () => {
    const text = textTable(data3WithFooter, header3, {
      theme: lightLineTheme,
      footer: true,
      border: true,
    })
    expect(text).toEqual(trim`
      ┌────────────┬────────┬───────┐
      │ Fruits     │    Max │   Avg │
      ├────────────┼────────┼───────┤
      │ Apples     │  37.50 │ 33.13 │
      │ Bananas    │   4.25 │  4.09 │
      │ Tangerines │  58.25 │ 45.34 │
      ├────────────┼────────┼───────┤
      │ Sum        │ 100.00 │ 34.03 │
      └────────────┴────────┴───────┘
     `)
  })

  it('should render a heavyLineTheme border', () => {
    const text = textTable(data3WithFooter, header3, {
      theme: heavyLineTheme,
      footer: true,
      border: true,
    })
    expect(text).toEqual(trim`
      ┏━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━┓
      ┃ Fruits     ┃    Max ┃   Avg ┃
      ┣━━━━━━━━━━━━╋━━━━━━━━╋━━━━━━━┫
      ┃ Apples     ┃  37.50 ┃ 33.13 ┃
      ┃ Bananas    ┃   4.25 ┃  4.09 ┃
      ┃ Tangerines ┃  58.25 ┃ 45.34 ┃
      ┣━━━━━━━━━━━━╋━━━━━━━━╋━━━━━━━┫
      ┃ Sum        ┃ 100.00 ┃ 34.03 ┃
      ┗━━━━━━━━━━━━┻━━━━━━━━┻━━━━━━━┛
     `)
  })

  it('should render a doubleLineTheme border', () => {
    const text = textTable(data3WithFooter, header3, {
      theme: doubleLineTheme,
      footer: true,
      border: true,
    })
    expect(text).toEqual(trim`
      ╔════════════╦════════╦═══════╗
      ║ Fruits     ║    Max ║   Avg ║
      ╠════════════╬════════╬═══════╣
      ║ Apples     ║  37.50 ║ 33.13 ║
      ║ Bananas    ║   4.25 ║  4.09 ║
      ║ Tangerines ║  58.25 ║ 45.34 ║
      ╠════════════╬════════╬═══════╣
      ║ Sum        ║ 100.00 ║ 34.03 ║
      ╚════════════╩════════╩═══════╝
     `)
  })
})
