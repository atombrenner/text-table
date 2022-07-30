// npx ts-node-dev --respawn -T example.ts

import {
  textTable,
  doubleLineTheme,
  lightLineTheme,
  heavyLineTheme,
  defaultTheme,
  minimalTheme,
} from './src/textTable'

const data = [
  ['Apples', 37.5, 33.13],
  ['Bananas', 4.246, 4.09001],
  ['Pears', 58.254, 45.34],
  ['Sum', 100, 34.030001],
]

const header = ['Fruits', 'Max', 'Avg']

console.log()

console.log(textTable([header, ...data], { header: true, footer: true }))
console.log(textTable(data, header, { footer: true, theme: defaultTheme }))
console.log(textTable(data, header, { footer: true, theme: minimalTheme }))
console.log(textTable(data, header, { footer: true, border: true }))
console.log(textTable(data, header, { footer: true, border: true, theme: lightLineTheme }))
console.log(textTable(data, header, { footer: true, border: true, theme: doubleLineTheme }))
console.log(textTable(data, header, { footer: true, border: true, theme: heavyLineTheme }))
