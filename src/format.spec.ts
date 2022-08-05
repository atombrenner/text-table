import { formatAny, formatNumber, formatPercent } from './textTable'

describe('format', () => {
  it.each([
    ['string', 'string'],
    ['', ''],
    [' trim  ', 'trim'],
    [null, 'null'],
    [undefined, 'undefined'],
    [17.345, '17.345'],
    [{ bla: 5 }, '[object Object]'],
  ])('formatAny should format %p as %s', (value, formatted) => {
    expect(formatAny(value)).toEqual(formatted)
  })

  it.each([
    [1, '1.00'],
    [0.123, '0.12'],
    [123.456, '123.46'],
    [null, '0.00'], // strange, maybe improve formatter
    [false, '0.00'], // strange, maybe improve formatter
    [undefined, 'NaN'],
    ['bla', 'NaN'],
    ['123', '123.00'], // do we really want to autoconvert
  ])('formatNumber(2) should format %p as %p', (value, formatted) => {
    expect(formatNumber(2)(value)).toEqual(formatted)
  })

  it.each([
    [0, '0'],
    [1, '0.1'],
    [2, '0.12'],
    [3, '0.123'],
    [4, '0.1235'], // note the rounding
    [5, '0.12346'], // note the rounding
  ])('formatNumber(%i) should format 0.123456 as %p', (decimalPlaces, formatted) => {
    const format = formatNumber(decimalPlaces)
    expect(format(0.123456)).toEqual(formatted)
  })

  it('formatNumber should append zero decimal places', () => {
    const format = formatNumber(3)
    expect(format(1.0)).toEqual('1.000')
    expect(format(1.1)).toEqual('1.100')
  })

  it('formatPercent should apply factor and decimal places', () => {
    const format100 = formatPercent(100, 0, '%')
    expect(format100(1.0)).toEqual('100%')
    expect(format100(0.5)).toEqual('50%')
    const format = formatPercent(1, 1, '%')
    expect(format(100.0)).toEqual('100.0%')
    expect(format(58.254)).toEqual('58.3%')
  })

  it('formatPercent should append custom percent symbol', () => {
    const format = formatPercent(100, 0, ' **')
    expect(format(1.0)).toEqual('100 **')
    expect(format(0.5)).toEqual('50 **')
  })
})
