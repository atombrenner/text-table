export const defaultTheme = ' -||||||||||'
export const minimalTheme = ' - ---------'
export const lightLineTheme = ' ─│┼├┤┌┬┐└┴┘'
export const heavyLineTheme = ' ━┃╋┣┫┏┳┓┗┻┛'
export const doubleLineTheme = ' ═║╬╠╣╔╦╗╚╩╝'

export type FormatFn = (v: unknown) => string
export const formatAny: FormatFn = (v) => `${v}`.trim()
export const formatNumber =
  (decimalPlaces: number): FormatFn =>
  (v: unknown) =>
    Number(v).toFixed(decimalPlaces)
export const formatUnit =
  (unitSign: string, factor: number, decimalPlaces: number): FormatFn =>
  (v: unknown) =>
    (Number(v) * factor).toFixed(decimalPlaces) + unitSign

export type AlignFn = (s: string, width: number) => string
export const alignLeft = (s: string, width: number) =>
  s.length > width ? s.substring(0, width - 1) + '…' : s.padEnd(width)
export const alignRight = (s: string, width: number) =>
  s.length > width ? '…' + s.substring(s.length - width + 1) : s.padStart(width)

export type ColumnSpec = {
  title: string
  format: FormatFn
  align: AlignFn
  titleAlign?: AlignFn
  maxWidth?: number
  fixedWidth?: number
}

export type Column = string | ColumnSpec | undefined

export type Options = Partial<{
  header: boolean // first row of data should be displayed in header
  footer: boolean // last row of data should be displayed in footer
  border: boolean // draw a border around the table
  theme: string // a theme string for drawing borders, see README.md
  columns: Column[] // customize a column, specify title, alignment, etc
  // calculateWidth: (s: string) => number // if data contains ANSI color codes, we would need to calculate the length differently
}>

export const stringLeft = (title: string) => ({
  title,
  format: formatAny,
  align: alignLeft,
})
export const string = stringLeft

export const stringRight = (title: string) => ({
  title,
  format: formatAny,
  align: alignRight,
})

export const number = (title: string, decimalPlaces = 2) => ({
  title,
  format: formatNumber(decimalPlaces),
  align: alignRight,
})

export const unit = (title: string, unitSign: string, factor = 1, decimalPlaces = 2) => ({
  title,
  format: formatUnit(unitSign, factor, decimalPlaces),
  align: alignRight,
})

export const percent = (title: string, factor = 100, decimalPlaces = 0) =>
  unit(title, ' %', factor, decimalPlaces)

const getMergedOptions = (columnsOrOptions?: Column[] | Options, maybeOptions?: Options) => {
  if (!columnsOrOptions || Array.isArray(columnsOrOptions)) {
    return { ...maybeOptions, columns: columnsOrOptions }
  } else {
    return columnsOrOptions
  }
}

export const getColumnSpecs = (data: unknown[][], options: Options): ColumnSpec[] => {
  const columns = options.columns ?? Array<string>(data.length > 0 ? data[0].length : 0).fill('')
  const probe = options.header ? data[1] : data[0]
  const specs = columns.map((column, i) => {
    if (typeof column === 'object') return column
    const title = column ?? ''
    return probe && typeof probe[i] === 'number' ? number(title) : string(title)
  })
  return options.header ? specs.map((spec, i) => ({ ...spec, title: `${data[0][i]}` })) : specs
}

const getFormattedData = (data: unknown[][], columns: ColumnSpec[]): string[][] =>
  data.map((row) => columns.map(({ format }, i) => format(row[i])))

const getAlignedData = (
  data: string[][],
  columns: ColumnSpec[],
  columnWidths: number[]
): string[][] => data.map((row) => columns.map(({ align }, i) => align(row[i], columnWidths[i])))

const getAligndHeader = (columns: ColumnSpec[], columnWidths: number[]): string[] =>
  columns.map(({ title, titleAlign, align }, i) => (titleAlign ?? align)(title, columnWidths[i]))

const getMaxColumnWidths = (data: string[][], columns: ColumnSpec[]) =>
  columns.map((column: ColumnSpec, columnIndex: number) =>
    Math.min(
      column.maxWidth ?? Number.POSITIVE_INFINITY,
      column.fixedWidth ??
        data.reduce(
          (maxWidth, row) => Math.max(maxWidth, row[columnIndex].length),
          column.title.length
        )
    )
  )

const separatorRow = ([line, join]: string[], widths: number[]) =>
  widths.flatMap((w) => line.repeat(w)).join(line + join + line)

const makeBordered = ([left, line, right]: string[]) => {
  const leftBorder = left + line
  const rightBorder = line + right
  return (row: string) => leftBorder + row + rightBorder
}

const identity = <T>(x: T) => x

export type TextTableFn = {
  (data: unknown[][]): string
  (data: unknown[][], columns: Column[], options?: Options): string
  (data: unknown[][], options: Options): string
}

export const textTable: TextTableFn = (
  data: unknown[][],
  columnsOrOptions?: Column[] | Options,
  maybeOptions?: Options
): string => {
  const options = getMergedOptions(columnsOrOptions, maybeOptions)
  const columns = getColumnSpecs(data, options)
  const formattedData = getFormattedData(options.header ? data.slice(1) : data, columns)
  const columnWidths = getMaxColumnWidths(formattedData, columns)
  const alignedData = getAlignedData(formattedData, columns, columnWidths)
  const alignedTitles = getAligndHeader(columns, columnWidths)

  const theme = options.theme ?? defaultTheme
  const themeChars = (...indices: number[]) => indices.map((i) => theme[i])

  const borderedRow = (outer: string[], inner: string[]) =>
    options.border ? [makeBordered(outer)(separatorRow(inner, columnWidths))] : []
  const topBorder = borderedRow(themeChars(6, 1, 8), themeChars(1, 7))
  const bottomBorder = borderedRow(themeChars(9, 1, 11), themeChars(1, 10))

  const maybeBordered = options.border ? makeBordered : () => identity
  const borderedData = maybeBordered(themeChars(2, 0, 2))
  const sepRow = maybeBordered(themeChars(4, 1, 5))(separatorRow(themeChars(1, 3), columnWidths))
  const sepCol = themeChars(0, 2, 0).join('')

  const headerRow = options.header || options.columns ? alignedTitles : undefined
  const header = headerRow ? [borderedData(headerRow.flat().join(sepCol)), sepRow] : []
  const footerRow = options.footer && alignedData.pop()
  const footer = footerRow ? [sepRow, borderedData(footerRow.flat().join(sepCol))] : []

  return (
    [
      ...topBorder,
      ...header,
      ...alignedData.map((row) => borderedData(row.flat().join(sepCol))),
      ...footer,
      ...bottomBorder,
    ].join('\n') + '\n'
  )
}
