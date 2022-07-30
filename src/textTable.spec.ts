import {
  textTable,
  lightLineTheme,
  heavyLineTheme,
  doubleLineTheme,
  stringLeft,
  number,
  alignLeft,
  alignRight,
  formatNumber,
  string,
  ColumnSpec,
} from './textTable'

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
  const header = ['Fruits', 'Max', 'Avg']
  const data = [
    ['Apples', 37.5, 33.129],
    ['Bananas', 4.246, 4.091],
    ['Tangerines', 58.254, 45.34],
  ]
  const dataWithFooter = [...data, ['Sum', 100, 34.030001]]
  const truncate = (data: unknown[][], columns: number) => data.map((r) => r.slice(0, columns))

  it('should render empty line for empty data and no column definition', () => {
    expect(textTable([])).toEqual('\n')
  })

  it('should render table without header for no column definition', () => {
    const text = textTable(data)
    expect(text).toEqual(trim`
      Apples     | 37.50 | 33.13
      Bananas    |  4.25 |  4.09
      Tangerines | 58.25 | 45.34
    `)
  })

  it('should render header only for empty data', () => {
    const text = textTable([], header)
    expect(text).toEqual(trim`
      Fruits | Max | Avg
      -------|-----|----                        
    `)
  })

  it('should render three columns with header', () => {
    const text = textTable(data, header)
    expect(text).toEqual(trim`
      Fruits     |   Max |   Avg
      -----------|-------|------
      Apples     | 37.50 | 33.13
      Bananas    |  4.25 |  4.09
      Tangerines | 58.25 | 45.34
    `)
  })

  it('should render one column data', () => {
    const text = textTable(truncate(data, 1), ['Fruits'])
    // careful, because first column is not right aligned, there is sensitive whitespaces in the expected value
    expect(text).toEqual(trim`
      Fruits    
      ----------
      Apples    
      Bananas   
      Tangerines
  `)
  })

  it('should render two column data', () => {
    const text = textTable(truncate(data, 2))
    expect(text).toEqual(trim`
    Apples     | 37.50
    Bananas    |  4.25
    Tangerines | 58.25
  `)
  })

  it('should render custom columns ', () => {
    const avgColumn = {
      title: 'Avg',
      align: alignRight,
      titleAlign: alignLeft,
      format: (s: unknown) => formatNumber(4)(s) + ' Ø',
    }
    const text = textTable(data, [stringLeft('Fruits'), number('Max', 3), avgColumn])
    expect(text).toEqual(trim`
      Fruits     |    Max | Avg      
      -----------|--------|----------
      Apples     | 37.500 | 33.1290 Ø
      Bananas    |  4.246 |  4.0910 Ø
      Tangerines | 58.254 | 45.3400 Ø
    `)
  })

  it('should render a fixedWidth column', () => {
    const column: ColumnSpec = { ...string('Fixed'), fixedWidth: 15 }
    const text = textTable(data, [column, 'Max'])
    expect(text).toEqual(trim`
      Fixed           |   Max
      ----------------|------
      Apples          | 37.50
      Bananas         |  4.25
      Tangerines      | 58.25
    `)
  })

  it('should render and cut a maxWidth column', () => {
    const col1: ColumnSpec = { ...string('MaxWidth'), maxWidth: 7 }
    const col2: ColumnSpec = { ...number('Max'), maxWidth: 4 }
    const text = textTable(data, [col1, col2])
    expect(text).toEqual(trim`
      MaxWid… |  Max
      --------|-----
      Apples  | ….50
      Bananas | 4.25
      Tanger… | ….25
    `)
  })

  it('should render a footer', () => {
    const text = textTable(dataWithFooter, header, { footer: true })
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
    const text = textTable(dataWithFooter, header, { footer: true, border: true })
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
    const text = textTable(dataWithFooter, header, {
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
    const text = textTable(dataWithFooter, header, {
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
    const text = textTable(dataWithFooter, header, {
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

  describe('given a sparse column definition', () => {
    it('should not render first column ', () => {
      const text = textTable(data, [, 'Max', 'Avg'])
      expect(text).toEqual(trim`
        Max |   Avg
      ------|------
      37.50 | 33.13
       4.25 |  4.09
      58.25 | 45.34
    `)
    })

    it('should not render second column', () => {
      const text = textTable(data, ['Fruits', , 'Avg'])
      expect(text).toEqual(trim`
      Fruits     |   Avg
      -----------|------
      Apples     | 33.13
      Bananas    |  4.09
      Tangerines | 45.34
    `)
    })

    it('should not render third column', () => {
      const text = textTable(data, ['Fruits', 'Max'])
      expect(text).toEqual(trim`
      Fruits     |   Max
      -----------|------
      Apples     | 37.50
      Bananas    |  4.25
      Tangerines | 58.25
    `)
    })

    it('should not render second and third column', () => {
      const text = textTable(data, ['Fruits'])
      expect(text).toEqual(trim`
      Fruits    
      ----------
      Apples    
      Bananas   
      Tangerines
    `)
    })
  })
})
