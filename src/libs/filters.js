import moment from 'moment'

export function timeFmt(time, format='YYYY-MM-DD') {
  return moment(time).format(format)
}