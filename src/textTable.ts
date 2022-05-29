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

// export const configure = () => {
//   const padding = ' '
//   return textTable
// }

export const normalizeColumns = (
  columnsOrTitles: (string | Column)[],
  firstRow: unknown[]
): Column[] => {
  const normalized = [...columnsOrTitles]
  while (normalized.length < firstRow.length) normalized.push('')
  return normalized.map((columnOrTitle, columnIndex) =>
    typeof columnOrTitle === 'string'
      ? typeof firstRow[columnIndex] === 'number'
        ? number(columnOrTitle)
        : string(columnOrTitle)
      : columnOrTitle
  )
}

const formatData = (data: unknown[][], columns: Column[]): string[][] =>
  data.map((row) => row.map((cell, column) => columns[column].format(cell)))

const alignData = (data: string[][], columns: Column[], columnWidths: number[]): string[][] =>
  data.map((row) => row.map((v, c) => columns[c].align(v, columnWidths[c])))

const alignHeader = (columns: Column[], columnWidths: number[]): string[] =>
  columns.map(({ title, titleAlign }, columnIndex) => titleAlign(title, columnWidths[columnIndex]))

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

export const textTable = (data: unknown[][], columnsOrTitles?: (string | Column)[]): string => {
  const columns = normalizeColumns(columnsOrTitles ?? [], data[0] ?? [])
  const formattedData = formatData(data, columns)
  const columnWidths = getMaxColumnWidths(formattedData, columns)
  const alignedData = alignData(formattedData, columns, columnWidths)

  // add header only if columnsOrTitles is defined
  const header = columnsOrTitles
    ? [
        alignHeader(columns, columnWidths).join(' | '),
        columnWidths.map((w) => '-'.repeat(w + 1)).join('|'),
      ]
    : []

  // apply padding lines
  return [...header, ...alignedData.map((row) => row.join(' | '))].join('\n') + '\n'
}
