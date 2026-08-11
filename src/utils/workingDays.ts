const DAY_IN_MS = 24 * 60 * 60 * 1000

function toUtcCalendarDate(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}

export function parseIsoCalendarDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    throw new Error(`Некорректная календарная дата: ${value}`)
  }

  return new Date(Date.UTC(year, month - 1, day))
}

export function calendarDaysUntil(isoDate: string, from = new Date()): number {
  const start = toUtcCalendarDate(from)
  const end = parseIsoCalendarDate(isoDate)

  return Math.max(0, Math.round((end.getTime() - start.getTime()) / DAY_IN_MS))
}

/** Считает будни в следующие N календарных дней, без праздников. */
export function countWorkingDays(calendarDays: number, from = new Date()): number {
  const days = Math.max(0, Math.trunc(calendarDays))
  const cursor = toUtcCalendarDate(from)
  let workingDays = 0

  for (let offset = 1; offset <= days; offset += 1) {
    const weekday = new Date(cursor.getTime() + offset * DAY_IN_MS).getUTCDay()

    if (weekday !== 0 && weekday !== 6) {
      workingDays += 1
    }
  }

  return workingDays
}
