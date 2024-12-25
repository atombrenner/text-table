# @atombrenner/text-table

Render text tables for display with monospaced fonts (terminal, &lt;pre>).

```
Fruits     |    Max |   Avg
-----------|--------|------
Apples     |  37.50 | 33.13
Bananas    |   4.25 |  4.09
Tangerines |  58.25 | 45.34
-----------|--------|------
Sum        | 100.00 | 34.03
```

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
- provide custom theme
- provide custom formatting per column

This package has zero dependencies.

## Usage Examples

```typescript
import { textTable, stringRight, number, lightLineTheme } from '@atombrenner/text-table'

const data = [
  ['Apples', 37.5, 33.13],
  ['Bananas', 4.246, 4.09001],
  ['Tangerines', 58.254, 45.34],
]
console.log(textTable(data))
```

```
Apples     | 37.50 | 33.13
Bananas    |  4.25 |  4.09
Tangerines | 58.25 | 45.34
```

- `textTable(data, ['Fruits', 'Percent'])`

```
Fruits     | Percent
-----------|--------
Apples     |   37.50
Bananas    |    4.25
Tangerines |   58.25
```

- `textTable(data, [stringRight('Fruits'), number('Percent', 3)])`

```
    Fruits | Percent
-----------|--------
    Apples |  37.500
   Bananas |   4.246
Tangerines |  58.254
```

- `textTable(data, ['Fruits', percent('Percent', 1)])`

```
    Fruits | Percent
-----------|--------
    Apples |   37.5%
   Bananas |    4.3%
Tangerines |   58.3%
```

- `textTable(data, ['Fruits', 'Max', 'Avg'], { footer: true, border: true, theme: lightLineTheme })`

```
┌────────────┬────────┬───────┐
│ Fruits     │    Max │   Avg │
├────────────┼────────┼───────┤
│ Apples     │  37.50 │ 33.13 │
│ Bananas    │   4.25 │  4.09 │
│ Tangerines │  58.25 │ 45.34 │
├────────────┼────────┼───────┤
│ Sum        │ 100.00 │ 34.03 │
└────────────┴────────┴───────┘
```

## Themes with header, footer and border

```
lightLineTheme:                doubleLineTheme:               heavyLineTheme:
┌─────────┬────────┬───────┐   ╔═════════╦════════╦═══════╗   ┏━━━━━━━━━┳━━━━━━━━┳━━━━━━━┓
│ Fruits  │    Max │   Avg │   ║ Fruits  ║    Max ║   Avg ║   ┃ Fruits  ┃    Max ┃   Avg ┃
├─────────┼────────┼───────┤   ╠═════════╬════════╬═══════╣   ┣━━━━━━━━━╋━━━━━━━━╋━━━━━━━┫
│ Apples  │  37.50 │ 33.13 │   ║ Apples  ║  37.50 ║ 33.13 ║   ┃ Apples  ┃  37.50 ┃ 33.13 ┃
│ Bananas │   4.25 │  4.09 │   ║ Bananas ║   4.25 ║  4.09 ║   ┃ Bananas ┃   4.25 ┃  4.09 ┃
│ Pears   │  58.25 │ 45.34 │   ║ Pears   ║  58.25 ║ 45.34 ║   ┃ Pears   ┃  58.25 ┃ 45.34 ┃
├─────────┼────────┼───────┤   ╠═════════╬════════╬═══════╣   ┣━━━━━━━━━╋━━━━━━━━╋━━━━━━━┫
│ Sum     │ 100.00 │ 34.03 │   ║ Sum     ║ 100.00 ║ 34.03 ║   ┃ Sum     ┃ 100.00 ┃ 34.03 ┃
└─────────┴────────┴───────┘   ╚═════════╩════════╩═══════╝   ┗━━━━━━━━━┻━━━━━━━━┻━━━━━━━┛
```

You can provide a custom theme by setting a template string if you don't
like one of the predefined themes.
A template string defines the [characters for border drawing](https://en.wikipedia.org/wiki/Box-drawing_character).

## Reference

Overloads:

- textTable(data)
- textTable(data, columns)
- textTable(data, columns, options)
- textTable(data, options)

## Gotchas

- no support for [ANSI escape sequences](https://en.wikipedia.org/wiki/ANSI_escape_code)
  or other zero-length terminal characters
