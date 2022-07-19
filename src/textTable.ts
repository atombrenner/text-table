type FormatFn = (v: unknown) => string

export const formatAny: FormatFn = (v) => `${v}`.trim()
export const formatNumber =
  (decimalPlaces: number): FormatFn =>
  (v: unknown) =>
    Number(v).toFixed(decimalPlaces)

type AlignFn = (s: string, width: number) => string

export const alignLeft = (s: string, width: number) => s.padEnd(width)
export const alignRight = (s: string, width: number) => s.padStart(width)

export type Column = {
  title: string
  titleAlign: AlignFn
  format: FormatFn
  align: AlignFn
  maxWidth: number
  fixedWidth?: number
}

export type TitleOrColumn = string | Column | undefined

export const stringLeft = (title: string) => ({
  title,
  format: formatAny,
  align: alignLeft,
  titleAlign: alignLeft,
  maxWidth: Number.POSITIVE_INFINITY,
})
export const string = stringLeft

export const stringRight = (title: string) => ({
  title,
  format: formatAny,
  align: alignRight,
  titleAlign: alignRight,
  maxWidth: Number.POSITIVE_INFINITY,
})

export const number = (title: string, decimalPlaces = 2) => ({
  title,
  format: formatNumber(decimalPlaces),
  align: alignRight,
  titleAlign: alignRight,
  maxWidth: Number.POSITIVE_INFINITY,
})

export const makeColumns = (
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

const formatData = (data: unknown[][], columns: Column[]): string[][] =>
  data.map((row) => columns.map(({ format }, i) => format(row[i])))

const alignData = (data: string[][], columns: Column[], columnWidths: number[]): string[][] =>
  data.map((row) => columns.map(({ align }, i) => align(row[i], columnWidths[i])))

const alignHeader = (columns: Column[], columnWidths: number[]): string[] =>
  columns.map(({ title, titleAlign }, i) => titleAlign(title, columnWidths[i]))

const getMaxColumnWidths = (data: string[][], columns: Column[]) =>
  columns.map((column: Column, columnIndex: number) =>
    Math.min(
      column.maxWidth,
      column.fixedWidth ??
        data.reduce(
          (maxWidth, row) => Math.max(maxWidth, row[columnIndex].length),
          column.title.length
        )
    )
  )

type BorderChars = {
  left: string
  line: string
  join: string
  right: string
}

const getBorderChars = (theme: string, left: number, join: number, right: number) => ({
  left: theme[left] ?? theme[1],
  line: theme[0],
  right: theme[right] ?? theme[1],
  join: theme[join] ?? theme[1],
})

const makeSeparator = (
  widths: number[],
  { left, line, join: cross, right }: BorderChars,
  border = false
) => {
  const row = widths.flatMap((w) => line.repeat(w)).join(line + cross + line)
  return border ? left + line + row + line + right : row
}

//const theme = '═║╬╠╣╔╦╗╚╩╝'
const theme = '-|'

type Options = Partial<{
  // header: boolean  // first row of data should be displayed in header
  footer: boolean // last row of data should be displayed in footer
  border: boolean // draw a border around the table
  theme: string // a theme string for drawing borders, see README.md
  // calculateWidth: (s: string) => number // if data contains ANSI color codes
}>

export const textTable = (
  data: unknown[][],
  titlesOrColumns?: TitleOrColumn[],
  options: Options = {}
): string => {
  const columns = makeColumns(titlesOrColumns, data[0])
  const formattedData = formatData(data, columns)
  const columnWidths = getMaxColumnWidths(formattedData, columns)
  const alignedData = alignData(formattedData, columns, columnWidths)
  const alignedHeaders = alignHeader(columns, columnWidths)

  const bordered = options.border
    ? (c: string) => theme[1] + ' ' + c + ' ' + theme[1]
    : (c: string) => c

  const topBorder = options.border
    ? [makeSeparator(columnWidths, getBorderChars(theme, 5, 6, 7), options.border)]
    : []

  const bottomBorder = options.border
    ? [makeSeparator(columnWidths, getBorderChars(theme, 8, 9, 10), options.border)]
    : []

  const separator = makeSeparator(columnWidths, getBorderChars(theme, 3, 2, 4), options.border)

  const innerVerticalLine = ' ' + theme[1] + ' '

  const header = titlesOrColumns
    ? [bordered(alignedHeaders.flat().join(innerVerticalLine)), separator]
    : []

  const footerRow = options.footer && alignedData.pop()
  const footer = footerRow ? [separator, bordered(footerRow.flat().join(innerVerticalLine))] : []

  return (
    [
      ...topBorder,
      ...header,
      ...alignedData.map((row) => bordered(row.flat().join(innerVerticalLine))),
      ...footer,
      ...bottomBorder,
    ].join('\n') + '\n'
  )
}
