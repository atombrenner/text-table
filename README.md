# @atombrenner/text-table

format data arrays as text tables for display with monospaced fonts

also simple number formatting

## Usage

```typescript
import { textTable, number } from '@atombrenner/text-table'

const data = [
  ['Apples', 37.5],
  ['Bananas', 4.246],
  ['Tangerines', 58.254],
]

console.log(textTable(data))
// Apples     │ 37.50 | 33.13
// Bananas    │  4.25 |  4.09
// Tangerines │ 58.25 | 45.34

console.log(textTable(data, ['Fruits', 'Percentage']))
// Fruits     │ Percentage
// ───────────┼───────────
// Apples     │      37.50
// Bananas    │       4.25
// Tangerines │      58.25

console.log(textTable(data, [left('Fruits'), number(Percentage, 3)]))
//     Fruits │ Percentage
// ───────────┼───────────
//     Apples │     37.500
//    Bananas │      4.246
// Tangerines │     58.254

const data3 = [
  ['Apples', 37.5, 33.13],
  ['Bananas', 4.246, 4.09],
  ['Tangerines', 58.254, 45.34],
]

console.log(textTable(data3, ['Fruits', 'Max', 'Avg'], [stringRight('Sum'), 100, 34.03]))
// Fruits     |    Max |   Avg
// -----------|--------|------
// Apples     │  37.50 | 33.13
// Bananas    │   4.25 |  4.09
// Tangerines │  58.25 | 45.34
// -----------|--------|------
//        Sum | 100.00 | 34.03

// NOTE: header and footer are just formatted data. We only need to know if we want to display separator
```

```typescript
import { textTable } from '@atombrenner/text-table'

const data = [
  ['Apples', 37.5],
  ['Bananas', 4.246],
  ['Tangerines', 58.254],
]

const textTable = configure(theme, padding, columns)
```

## Max Themed Border

```typescript
// /-----------------------------\
// | Fruits     |    Max |   Avg |
// |------------|--------|-------|
// | Apples     │  37.50 | 33.13 |
// | Bananas    │   4.24 |  4.09 |
// | Tangerines │  58.25 | 45.34 |
// |------------|--------|-------|
// | Sum        | 100.00 | 34.03 |
// \-----------------------------/
```

Border

- hline
- vline
- cross
- edgeTopLeft, TopRight, bottomRight, bottomLeft

## TODO

- we never need padding, only an option for border (horizontal, vertical)
- allow ansi colors, count weird unicode symbols correctly
