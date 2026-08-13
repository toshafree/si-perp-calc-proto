import { describe, expect, it } from 'vitest'
import {
  DEAL_SETTINGS_STORAGE_KEY,
  loadDealSettings,
  saveDealSettings,
  type SettingsStorage,
} from './dealSettings'

function createStorage(initialValue: string | null = null): SettingsStorage & { value: string | null } {
  return {
    value: initialValue,
    getItem() {
      return this.value
    },
    setItem(key, value) {
      expect(key).toBe(DEAL_SETTINGS_STORAGE_KEY)
      this.value = value
    },
  }
}

describe('deal settings storage', () => {
  it('сохраняет и читает настройки этого типа калькулятора', () => {
    const storage = createStorage()
    const settings = {
      pairs: 3,
      ownCapital: 100_000,
      loanRate: 18.5,
      regression: { timeframe: '15м' as const, candles: 1_500 },
    }

    expect(saveDealSettings(storage, settings)).toBe(true)
    expect(loadDealSettings(storage)).toEqual(settings)
  })

  it('игнорирует поврежденные или невалидные настройки', () => {
    expect(loadDealSettings(createStorage('{bad json'))).toBeNull()
    expect(loadDealSettings(createStorage(JSON.stringify({ pairs: 0 })))).toBeNull()
  })
})
