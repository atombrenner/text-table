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

export type AlignFn = (s: string, width: number) => string
export const alignLeft = (s: string, width: number) =>
  s.length > width ? s.substring(0, width - 1) + '…' : s.padEnd(width)
export const alignRight = (s: string, width: number) =>
  s.length > width ? '…' + s.substring(s.length - width + 1) : s.padStart(width)

export type Column = {
  title: string
  titleAlign: AlignFn
  format: FormatFn
  align: AlignFn
  maxWidth?: number
  fixedWidth?: number
}

export type TitleOrColumn = string | Column | undefined

export const stringLeft = (title: string) => ({
  title,
  format: formatAny,
  align: alignLeft,
  titleAlign: alignLeft,
})
export const string = stringLeft

export const stringRight = (title: string) => ({
  title,
  format: formatAny,
  align: alignRight,
  titleAlign: alignRight,
})

export const number = (title: string, decimalPlaces = 2) => ({
  title,
  format: formatNumber(decimalPlaces),
  align: alignRight,
  titleAlign: alignRight,
})

export const getColumns = (
  titlesOrColumns: TitleOrColumn[] | undefined,
  firstRow: unknown[] | undefined
): Column[] => {
  if (!titlesOrColumns) {
    titlesOrColumns = firstRow ? Array<string>(firstRow.length).fill('') : []
  }
  if (!firstRow) {
    firstRow = Array<unknown>(titlesOrColumns.length).fill('')
  }

  return titlesOrColumns.map((titleOrColumn, i) => {
    if (typeof titleOrColumn === 'object') return titleOrColumn
    const title = titleOrColumn ?? ''
    // @ts-expect-error -- seems to be a typescript bug because firstRow is always defined at this point
    return typeof firstRow[i] === 'number' ? number(title) : string(title)
  })
}

const getFormattedData = (data: unknown[][], columns: Column[]): string[][] =>
  data.map((row) => columns.map(({ format }, i) => format(row[i])))

const getAlignedData = (data: string[][], columns: Column[], columnWidths: number[]): string[][] =>
  data.map((row) => columns.map(({ align }, i) => align(row[i], columnWidths[i])))

const getAligndHeader = (columns: Column[], columnWidths: number[]): string[] =>
  columns.map(({ title, titleAlign }, i) => titleAlign(title, columnWidths[i]))

const getMaxColumnWidths = (data: string[][], columns: Column[]) =>
  columns.map((column: Column, columnIndex: number) =>
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

type Options = Partial<{
  header: boolean // first row of data should be displayed in header
  footer: boolean // last row of data should be displayed in footer
  border: boolean // draw a border around the table
  theme: string // a theme string for drawing borders, see README.md
  // columns: TitleOrColumn[]
  // calculateWidth: (s: string) => number // if data contains ANSI color codes
}>

export const textTable = (
  data: unknown[][],
  titlesOrColumns?: TitleOrColumn[], // columnsOrOptions = {}
  options: Options = {}
): string => {
  const columns = getColumns(titlesOrColumns, data[0])
  const formattedData = getFormattedData(data, columns)
  const columnWidths = getMaxColumnWidths(formattedData, columns)
  const alignedData = getAlignedData(formattedData, columns, columnWidths)
  const alignedTitles = getAligndHeader(columns, columnWidths)

  const theme = options.theme ?? defaultTheme
  const themeChars = (...indices: number[]) => indices.map((i) => theme[i])

  const borderRow = (outer: string[], inner: string[]) =>
    options.border ? [makeBordered(outer)(separatorRow(inner, columnWidths))] : []
  const topBorder = borderRow(themeChars(6, 1, 8), themeChars(1, 7))
  const bottomBorder = borderRow(themeChars(9, 1, 11), themeChars(1, 10))

  const maybeBordered = options.border ? makeBordered : () => identity
  const borderedData = maybeBordered(themeChars(2, 0, 2))
  const sepRow = maybeBordered(themeChars(4, 1, 5))(separatorRow(themeChars(1, 3), columnWidths))
  const sepCol = themeChars(0, 2, 0).join('')

  const header = titlesOrColumns ? [borderedData(alignedTitles.flat().join(sepCol)), sepRow] : []
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
