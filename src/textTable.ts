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

export type ColumnOrTitle = Column | string | undefined

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
  columnsOrTitles: ColumnOrTitle[] | undefined,
  firstRow: unknown[] | undefined
): Column[] => {
  if (!firstRow) {
    if (!columnsOrTitles) return []
    firstRow = Array.from(columnsOrTitles).fill('')
  }
  const columns = columnsOrTitles ? [...columnsOrTitles] : Array.from(firstRow).fill('')
  // null/undefined should behave like holes in the array
  // can't use map to create "holes", so we need to mutate the array
  for (let i = 0; i < columns.length; i += 1) {
    const item = columns[i]
    // use loose equality == here to check if item is null or undefined
    if (item == null) {
      delete columns[i] // punch a hole in the array
    } else if (typeof item === 'string') {
      columns[i] = typeof firstRow[i] === 'number' ? number(item) : string(item)
    }
  }
  columns.length = firstRow.length
  return columns as Column[]
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

// expected future overloads (data, columns, options)
export const textTable = (data: unknown[][], columnsOrTitles?: ColumnOrTitle[]): string => {
  const columns = makeColumns(columnsOrTitles, data[0])
  const formattedData = formatData(data, columns)
  const columnWidths = getMaxColumnWidths(formattedData, columns)
  const alignedData = alignData(formattedData, columns, columnWidths)

  // add header only if columnsOrTitles is defined
  const header = columnsOrTitles
    ? [
        // TODO: remove flats here
        alignHeader(columns, columnWidths).flat().join(' | '),
        columnWidths
          .flat() // remove flat
          .map((w) => '-'.repeat(w))
          .join('-|-'),
      ]
    : []

  // apply padding lines

  // return [...header, ...alignedData.map((row) => row.join(' | '))].join('\n') + '\n'
  return (
    [
      ...header,
      ...alignedData.map((row) =>
        columns
          .map((_, i) => row[i])
          .flat() // TODO super ugly and possible inefficient
          .join(' | ')
      ),
    ].join('\n') + '\n'
  )
}
