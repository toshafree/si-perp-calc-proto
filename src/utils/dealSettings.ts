export const DEAL_SETTINGS_STORAGE_KEY = 'spread-insight:calculator:moex-futures-perpetual'

export const regressionTimeframes = ['1м', '5м', '15м', '30м', '1ч', '1д'] as const

export type RegressionTimeframe = typeof regressionTimeframes[number]

export interface DealSettings {
  pairs: number
  ownCapital: number
  loanRate: number
  regression: {
    timeframe: RegressionTimeframe
    candles: number
  }
}

export type SettingsStorage = Pick<Storage, 'getItem' | 'setItem'>

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isRegressionTimeframe(value: unknown): value is RegressionTimeframe {
  return regressionTimeframes.includes(value as RegressionTimeframe)
}

export function loadDealSettings(storage: SettingsStorage | null): DealSettings | null {
  if (!storage) return null

  try {
    const rawValue = storage.getItem(DEAL_SETTINGS_STORAGE_KEY)
    if (!rawValue) return null

    const value: unknown = JSON.parse(rawValue)
    if (!value || typeof value !== 'object') return null

    const candidate = value as Partial<DealSettings>
    const regression = candidate.regression

    if (
      !isFiniteNumber(candidate.pairs)
      || candidate.pairs < 1
      || !isFiniteNumber(candidate.ownCapital)
      || candidate.ownCapital < 0
      || !isFiniteNumber(candidate.loanRate)
      || candidate.loanRate < 0
      || !regression
      || !isRegressionTimeframe(regression.timeframe)
      || !isFiniteNumber(regression.candles)
      || regression.candles < 1
    ) {
      return null
    }

    return {
      pairs: Math.trunc(candidate.pairs),
      ownCapital: candidate.ownCapital,
      loanRate: candidate.loanRate,
      regression: {
        timeframe: regression.timeframe,
        candles: Math.trunc(regression.candles),
      },
    }
  } catch {
    return null
  }
}

export function saveDealSettings(
  storage: SettingsStorage | null,
  settings: DealSettings,
): boolean {
  if (!storage) return false

  try {
    storage.setItem(DEAL_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    return true
  } catch {
    return false
  }
}

export function getBrowserSettingsStorage(): SettingsStorage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}
