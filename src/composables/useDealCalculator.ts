import { computed, ref } from 'vue'
import { dealConfig } from '../config/dealConfig'
import { calendarDaysUntil, countWorkingDays } from '../utils/workingDays'

export type DealDirection = 'Short' | 'Long' | 'Neutral'

export interface DealInputs {
  daysInTrade: number
  workingDays: number
  fundingRate: number
  pairs: number
  positionMargin: number
  ownCapital: number
  useLoan: boolean
  loanRate: number
  spreadEntry: number
  spreadExit: number
}

export interface DealMetrics {
  direction: DealDirection
  totalMargin: number
  borrowedCapital: number
  totalCapital: number
  leverage: number | null
  loanCostPerDay: number
  spreadIncome: number
  fundingResult: number
  loanCost: number
  commission: number
  dealResult: number
  roiBase: number
  roi: number
  annualizedReturn: number
}

export function interpolateSpreadExit(
  spreadEntry: number,
  daysInTrade: number,
  baseDaysToExpiration: number,
): number {
  if (baseDaysToExpiration <= 0) return 0

  const boundedDays = Math.min(Math.max(daysInTrade, 0), baseDaysToExpiration)
  const interpolated = spreadEntry * (1 - boundedDays / baseDaysToExpiration)
  return Math.round((interpolated + Number.EPSILON) * 10) / 10
}

export function calculateMoexPositionMargin(
  pairs: number,
  futMargin: number,
  perpMargin: number,
): number {
  const normalizedPairs = Math.max(0, Math.trunc(pairs))
  return normalizedPairs * Math.max(futMargin, perpMargin, 0)
}

export function calculateDeal(inputs: DealInputs): DealMetrics {
  const pairs = Math.max(0, Math.trunc(inputs.pairs))
  const daysInTrade = Math.max(0, inputs.daysInTrade)
  const totalMargin = Math.max(inputs.positionMargin, 0)
  const ownCapital = Math.max(0, inputs.ownCapital)
  const borrowedCapital = inputs.useLoan ? Math.max(totalMargin - ownCapital, 0) : 0
  const totalCapital = ownCapital + borrowedCapital
  const leverage = ownCapital > 0 ? totalCapital / ownCapital : null
  const loanCostPerDay = borrowedCapital * Math.max(inputs.loanRate, 0) / 100 / 365
  const loanCost = inputs.useLoan ? loanCostPerDay * daysInTrade : 0

  const direction: DealDirection = inputs.spreadExit < inputs.spreadEntry
    ? 'Short'
    : inputs.spreadExit > inputs.spreadEntry
      ? 'Long'
      : 'Neutral'

  const spreadIncome = Math.abs(inputs.spreadEntry - inputs.spreadExit) * pairs
  const fundingResult = direction === 'Short'
    ? -inputs.fundingRate * dealConfig.fundingMultiplier * pairs * inputs.workingDays
    : direction === 'Long'
      ? inputs.fundingRate * dealConfig.fundingMultiplier * pairs * inputs.workingDays
      : 0
  const commission = pairs * dealConfig.commissionPerContract * 4
  const dealResult = spreadIncome + fundingResult - loanCost - commission
  const roiBase = borrowedCapital > 0 ? Math.min(totalMargin, ownCapital) : totalMargin
  const roi = roiBase > 0 ? dealResult / roiBase : 0
  const annualizedReturn = daysInTrade > 0 ? roi / daysInTrade * 365 : 0

  return {
    direction,
    totalMargin,
    borrowedCapital,
    totalCapital,
    leverage,
    loanCostPerDay,
    spreadIncome,
    fundingResult,
    loanCost,
    commission,
    dealResult,
    roiBase,
    roi,
    annualizedReturn,
  }
}

export function useDealCalculator(today = new Date()) {
  const baseDaysToExpiration = calendarDaysUntil(dealConfig.expirationDate, today)
  const daysInTrade = ref<number>(baseDaysToExpiration)
  const fundingRate = ref<number>(dealConfig.defaultFundingRate)
  const pairs = ref<number>(dealConfig.defaultPairs)
  const positionMargin = ref<number>(calculateMoexPositionMargin(
    pairs.value,
    dealConfig.futMargin,
    dealConfig.perpMargin,
  ))
  const positionMarginIsManual = ref(false)
  const ownCapital = ref<number>(dealConfig.defaultOwnCapital)
  const useLoan = ref(false)
  const loanRate = ref<number>(dealConfig.defaultLoanRate)
  const spreadEntry = ref<number>(dealConfig.defaultEntrySpread)
  const spreadExit = ref<number>(
    interpolateSpreadExit(spreadEntry.value, daysInTrade.value, baseDaysToExpiration),
  )
  const spreadExitIsManual = ref(false)

  const workingDays = computed(() => countWorkingDays(daysInTrade.value, today))
  const metrics = computed(() => calculateDeal({
    daysInTrade: daysInTrade.value,
    workingDays: workingDays.value,
    fundingRate: fundingRate.value,
    pairs: pairs.value,
    positionMargin: positionMargin.value,
    ownCapital: ownCapital.value,
    useLoan: useLoan.value,
    loanRate: loanRate.value,
    spreadEntry: spreadEntry.value,
    spreadExit: spreadExit.value,
  }))

  function recalculateSpreadExit(): void {
    spreadExit.value = interpolateSpreadExit(
      spreadEntry.value,
      daysInTrade.value,
      baseDaysToExpiration,
    )
    spreadExitIsManual.value = false
  }

  function setDaysInTrade(value: number): void {
    daysInTrade.value = Math.min(
      Math.max(Math.trunc(value), 0),
      baseDaysToExpiration,
    )
    recalculateSpreadExit()
  }

  function resetDaysToExpiration(): void {
    daysInTrade.value = baseDaysToExpiration
    recalculateSpreadExit()
  }

  function setPairs(value: number): void {
    pairs.value = Math.max(1, Math.trunc(value))

    if (!positionMarginIsManual.value) {
      resetPositionMargin()
    }
  }

  function setPositionMargin(value: number): void {
    positionMargin.value = Math.max(value, 0)
    positionMarginIsManual.value = true
  }

  function resetPositionMargin(): void {
    positionMargin.value = calculateMoexPositionMargin(
      pairs.value,
      dealConfig.futMargin,
      dealConfig.perpMargin,
    )
    positionMarginIsManual.value = false
  }

  function setSpreadEntry(value: number): void {
    spreadEntry.value = value

    if (!spreadExitIsManual.value) {
      recalculateSpreadExit()
    }
  }

  function setSpreadExit(value: number): void {
    spreadExit.value = Math.round((value + Number.EPSILON) * 10) / 10
    spreadExitIsManual.value = true
  }

  return {
    baseDaysToExpiration,
    daysInTrade,
    workingDays,
    fundingRate,
    pairs,
    positionMargin,
    positionMarginIsManual,
    ownCapital,
    useLoan,
    loanRate,
    spreadEntry,
    spreadExit,
    spreadExitIsManual,
    metrics,
    setDaysInTrade,
    resetDaysToExpiration,
    setPairs,
    setPositionMargin,
    resetPositionMargin,
    setSpreadEntry,
    setSpreadExit,
    recalculateSpreadExit,
  }
}

export type DealCalculator = ReturnType<typeof useDealCalculator>
