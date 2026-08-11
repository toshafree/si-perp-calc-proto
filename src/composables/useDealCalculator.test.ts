import { describe, expect, it } from 'vitest'
import {
  calculateDeal,
  interpolateSpreadExit,
  useDealCalculator,
  type DealInputs,
} from './useDealCalculator'

const baseInputs: DealInputs = {
  daysInTrade: 37,
  workingDays: 27,
  fundingRate: 0.012,
  pairs: 1,
  ownCapital: 500_000,
  useLoan: false,
  loanRate: 21,
  spreadEntry: 645,
  spreadExit: 0,
}

describe('calculateDeal', () => {
  it('совпадает с проверочным Short-сценарием', () => {
    const result = calculateDeal(baseInputs)

    expect(result.direction).toBe('Short')
    expect(result.spreadIncome).toBe(645)
    expect(result.fundingResult).toBeCloseTo(-324)
    expect(result.commission).toBeCloseTo(1.8)
    expect(result.loanCost).toBe(0)
    expect(result.dealResult).toBeCloseTo(319.2)
    expect(result.roi).toBeCloseTo(319.2 / 24_700)
    expect(result.annualizedReturn).toBeCloseTo((319.2 / 24_700) / 37 * 365)
  })

  it('делает фандинг доходом для Long', () => {
    const result = calculateDeal({ ...baseInputs, spreadEntry: 0, spreadExit: 645 })

    expect(result.direction).toBe('Long')
    expect(result.fundingResult).toBeCloseTo(324)
  })

  it('умножает фандинг на количество пар', () => {
    const result = calculateDeal({ ...baseInputs, pairs: 3 })

    expect(result.fundingResult).toBeCloseTo(-972)
  })

  it('умножает комиссию на четыре контракта сделки и число пар', () => {
    const result = calculateDeal({ ...baseInputs, pairs: 3 })

    expect(result.commission).toBeCloseTo(5.4)
  })

  it('считает заем, его стоимость и ROI от собственного капитала под ГО', () => {
    const result = calculateDeal({
      ...baseInputs,
      ownCapital: 10_000,
      useLoan: true,
      loanRate: 21,
    })

    expect(result.borrowedCapital).toBe(14_700)
    expect(result.loanCostPerDay).toBeCloseTo(14_700 * 0.21 / 365)
    expect(result.loanCost).toBeCloseTo(14_700 * 0.21 / 365 * 37)
    expect(result.roiBase).toBe(10_000)
    expect(result.roi).toBeCloseTo(result.dealResult / 10_000)
  })

  it('без фактического займа считает ROI от общего ГО', () => {
    const result = calculateDeal({ ...baseInputs, useLoan: true })

    expect(result.borrowedCapital).toBe(0)
    expect(result.roiBase).toBe(24_700)
  })

  it('не возвращает Infinity при нулевом капитале или сроке', () => {
    const result = calculateDeal({
      ...baseInputs,
      daysInTrade: 0,
      pairs: 0,
      ownCapital: 0,
      useLoan: true,
    })

    expect(result.leverage).toBeNull()
    expect(result.roi).toBe(0)
    expect(result.annualizedReturn).toBe(0)
  })
})

describe('interpolateSpreadExit', () => {
  it('линейно сводит спред к нулю к экспирации', () => {
    expect(interpolateSpreadExit(645, 37, 37)).toBe(0)
    expect(interpolateSpreadExit(645, 18.5, 37)).toBeCloseTo(322.5)
    expect(interpolateSpreadExit(645, 0, 37)).toBe(645)
  })

  it('ограничивает горизонт датой экспирации', () => {
    expect(interpolateSpreadExit(645, 50, 37)).toBe(0)
  })
})

describe('useDealCalculator', () => {
  it('сохраняет ручной спред выхода до изменения срока', () => {
    const calculator = useDealCalculator(new Date('2026-08-11T12:00:00+04:00'))

    calculator.setSpreadExit(123)
    calculator.fundingRate.value = 0.03
    calculator.setSpreadEntry(700)

    expect(calculator.spreadExit.value).toBe(123)
    expect(calculator.spreadExitIsManual.value).toBe(true)

    calculator.setDaysInTrade(20)

    expect(calculator.spreadExit.value).toBe(321.6)
    expect(calculator.spreadExitIsManual.value).toBe(false)
  })

  it('сбрасывает срок и спред выхода к экспирации', () => {
    const calculator = useDealCalculator(new Date('2026-08-11T12:00:00+04:00'))

    calculator.setDaysInTrade(10)
    calculator.setSpreadExit(88)
    calculator.resetDaysToExpiration()

    expect(calculator.daysInTrade.value).toBe(37)
    expect(calculator.spreadExit.value).toBe(0)
  })

  it('округляет ручной спред выхода до одного знака', () => {
    const calculator = useDealCalculator(new Date('2026-08-11T12:00:00+04:00'))

    calculator.setSpreadExit(123.46)

    expect(calculator.spreadExit.value).toBe(123.5)
  })
})
