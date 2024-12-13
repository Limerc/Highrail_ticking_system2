import type { Duration } from "@/apis/ticket"
import Decimal from "decimal.js"
import router from "@/router"

export function convertDate(date: string): Date
export function convertDate(date: Date): string
export function convertDate(date: string | Date): string | Date {
  if (typeof date === 'string') {
    return new Date(date)
  } else if (typeof date === 'object') {
    return date.toLocaleDateString()
      .replaceAll(/\/\d{1,2}/g,
        v => `-${v.slice(1).padStart(2, '0')}`)
  } else {
    throw new Error('Invalid date format')
  }
}

export function splitDateTime(obj: { begin_time: string, arrive_time: string, duration: Duration }) {
  const begins = obj.begin_time.split('T')
  const arrives = obj.arrive_time.split('T')
  const hours = (obj.duration.days * 24 * 60 * 60 +
    obj.duration.hours * 60 * 60 +
    obj.duration.minutes * 60 +
    obj.duration.seconds) / 60 / 60
  const price = hours * 100
  return {
    ...obj,
    begin_date: begins[0],
    arrive_date: arrives[0],
    begin_time: begins[1].slice(0, 5),
    arrive_time: arrives[1].slice(0, 5),
    cost: new Decimal(price).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
  }
}

export function convertDuration({ days, hours, minutes }: Duration) {
  let tot = ''
  if (days) tot += `${days}天`
  if (hours) tot += `${hours}时`
  if (minutes) tot += `${minutes}分`
  return tot
}

export function logout() {
  router.push({ name: 'login' })
}
