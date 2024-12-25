import { formatAny, formatNumber, formatUnit } from './textTable'

describe('format', () => {
  it.each([
    ['string', 'string'],
    ['', ''],
    [' trim  ', 'trim'],
    [null, 'null'],
    [undefined, 'undefined'],
    [17.345, '17.345'],
    [{ bla: 5 }, '[object Object]'],
    [new Date('2024-01-01T01:02:03.004Z'), '2024-01-01T01:02:03.004Z'],
  ])('formatAny() should format %p as "%s"', (value, formatted) => {
    expect(formatAny()(value)).toEqual(formatted)
  })

  it.each([
    [1, '1.00'],
    [0.123, '0.12'],
    [123.456, '123.46'],
    [null, '0.00'], // strange, results from coercion to number
    [false, '0.00'], // strange, results from coercion to number
    [undefined, 'NaN'],
    ['bla', 'NaN'],
    ['123', '123.00'], // strange, results from coercion to number
  ])('formatNumber(2) should format %p as "%s"', (value, formatted) => {
    expect(formatNumber(2)(value)).toEqual(formatted)
  })

  it.each([
    [0, '0'],
    [1, '0.1'],
    [2, '0.12'],
    [3, '0.123'],
    [4, '0.1235'], // note the rounding
    [5, '0.12346'], // note the rounding
  ])('formatNumber(%i) should format 0.123456 as "%s"', (decimalPlaces, formatted) => {
    const format = formatNumber(decimalPlaces)
    expect(format(0.123456)).toEqual(formatted)
  })

  it('formatNumber(3) should append zero decimal places', () => {
    const format = formatNumber(3)
    expect(format(1.0)).toEqual('1.000')
    expect(format(1.1)).toEqual('1.100')
  })

  it('formatUnit should apply unit sign, factor and decimal places', () => {
    const format100 = formatUnit('%', 100, 0)
    expect(format100(1.0)).toEqual('100%')
    expect(format100(0.5)).toEqual('50%')
    const format = formatUnit(' KB', 1, 1)
    expect(format(100.0)).toEqual('100.0 KB')
    expect(format(58.254)).toEqual('58.3 KB')
  })
})
