# @atombrenner/text-table

Create text tables for display with monospaced fonts from data arrays with sensible defaults:

- minimal bordering
- autodetect column type (string or number)
- right align number columns
- optional header with column names

For more advanced use cases you can

- provide your own formatting function per column
- specify a max or fixed width per column
- specify alignment per column
- display a footer
- add borders
- provide your own bordering theme

This package has zero dependencies.

## Usage

```typescript
import { textTable, number } from '@atombrenner/text-table'

const data = [
  ['Apples', 37.5],
  ['Bananas', 4.246],
  ['Tangerines', 58.254],
]

console.log(textTable(data))
// Apples     | 37.50 | 33.13
// Bananas    |  4.25 |  4.09
// Tangerines | 58.25 | 45.34

console.log(textTable(data, ['Fruits', 'Percentage']))
// Fruits     | Percentage
// -----------|-----------
// Apples     |      37.50
// Bananas    |       4.25
// Tangerines |      58.25

console.log(textTable(data, [stringLeft('Fruits'), number(Percentage, 3)]))
//     Fruits | Percentage
// -----------|-----------
//     Apples |     37.500
//    Bananas |      4.246
// Tangerines |     58.254

const data3 = [
  ['Apples', 37.5, 33.13],
  ['Bananas', 4.246, 4.09001],
  ['Tangerines', 58.254, 45.34],
  ['Sum', 100, 34.030001]
]

console.log(textTable(data3, ['Fruits', 'Max', 'Avg'], { footer: true })
// Fruits     |    Max |   Avg
// -----------|--------|------
// Apples     |  37.50 | 33.13
// Bananas    |   4.25 |  4.09
// Tangerines |  58.25 | 45.34
// -----------|--------|------
// Sum        | 100.00 | 34.03
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

```
// /-----------------------------\
// | Fruits     |    Max |   Avg |
// |------------+--------+-------|
// | Apples     │  37.50 | 33.13 |
// | Bananas    │   4.24 |  4.09 |
// | Tangerines │  58.25 | 45.34 |
// |------------+--------+-------|
// | Sum        | 100.00 | 34.03 |
// \-----------------------------/
// theme:
```

Templates
'-|'
'-|+'
'═║╬╠╣╔╦╗╚╩╝'

see https://en.wikipedia.org/wiki/Box-drawing_character

## TODO

- we never need padding, only an option for enabling a border around the table (horizontal, vertical)
- allow ansi colors, count weird unicode symbols correctly
