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

type Options = Partial<{
  theme: string
  footer: boolean
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

  const bordered = (s: string) => string

  // add header only if titlesOrColumns is defined
  const header = titlesOrColumns
    ? [
        alignHeader(columns, columnWidths).flat().join(' | '),
        columnWidths.flatMap((w) => '-'.repeat(w)).join('-|-'),
      ]
    : []

  const footer = options.footer
    ? [columnWidths.flatMap((w) => '-'.repeat(w)).join('-|-'), alignedData.pop()]
    : []

  return (
    [
      // border
      ...header,
      ...alignedData.map((row) => row.flat().join(' | ')),
      ...footer,
      // border
    ].join('\n') + '\n'
  )
}
