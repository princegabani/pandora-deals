import { format, getTime, formatDistanceToNow } from 'date-fns';
import moment from 'moment';

// ----------------------------------------------------------------------

export function dateFormat(date) {
  return date ? moment.unix(date).format('DD-MM-YYYY') : '-';
}
export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}

export function formatDistanceDay(date) {

  return date ? moment.unix(date).diff(new Date(), 'days') + ' left' : 'none'

  // const oneDay = 1000 * 3600 * 24;
  // console.log(Date.now())
  // console.log(date)
  // const distance = Date.now() - date;
  // if (distance < oneDay && distance > 0) {
  //   return "today";
  // }
  // return formatDistanceToNow(date, { addSuffix: true })
}