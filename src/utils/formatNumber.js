import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fRupees(num, currency = 'INR') {
  let number = Number(num)
  return num ? number.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: currency
  }) : 0
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0 ,0') : '';
  // const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
