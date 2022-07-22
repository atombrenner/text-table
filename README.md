# @atombrenner/text-table

Render text tables for display with monospaced fonts (terminal, &lt;pre>).

Everything has sensible defaults to give you a pretty text table without configuration:

- minimal bordering
- autodetect column type (string or number)
- right align number columns
- format numbers with two decimal digits

For more advanced use cases you can

- provide a header with column names
- specify a max or fixed width per column
- specify alignment per column
- display a footer
- add borders
- provide your own bordering theme
- provide your own formatting function per column

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
// Apples     | 37.50
// Bananas    |  4.25
// Tangerines | 58.25

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

## Gotchas

- no support for ansi colors, can be solved by injecting a custom string length function that ignores zero length terminal codes
