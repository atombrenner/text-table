# @atombrenner/text-table

format data arrays as text tables for display in monospaced fonts

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
// Apples     │ 37.50
// Bananas    │  4.25
// Tangerines │ 58.25

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

## TODO

- allow ansi colors, count weird unicode symbols correctly
