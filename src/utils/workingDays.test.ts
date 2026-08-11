import { describe, expect, it } from 'vitest'
import { calendarDaysUntil, countWorkingDays } from './workingDays'

describe('calendar utilities', () => {
  it('считает дни до экспирации без времени суток', () => {
    expect(calendarDaysUntil('2026-09-17', new Date('2026-08-11T18:30:00+04:00'))).toBe(37)
  })

  it('считает будни без праздников', () => {
    expect(countWorkingDays(37, new Date('2026-08-11T18:30:00+04:00'))).toBe(27)
    expect(countWorkingDays(0, new Date('2026-08-11T18:30:00+04:00'))).toBe(0)
  })
})
