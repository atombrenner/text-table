// npx ts-node-dev --respawn -T example.ts

import { textTable } from './src/textTable'

const data = [
  ['Apples', 37.5, 33.13],
  ['Bananas', 4.246, 4.09001],
  ['Tangerines', 58.254, 45.34],
  ['Sum', 100, 34.030001],
]

console.log(textTable(data, ['Fruits', 'Max', 'Avg'], { footer: true, border: true }))
