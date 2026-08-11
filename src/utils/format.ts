const ruNumber = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 4,
})

const ruPercent = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) return '—'

  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits }).format(value)
}

export function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—'

  const fractionDigits = value !== 0 && Math.abs(value) < 1 ? 4 : 2
  return `${new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value)} ₽`
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return `${ruPercent.format(value * 100)}%`
}

export function formatRate(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return ruNumber.format(value)
}

export function formatLeverage(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return 'н/д'
  return `${new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}×`
}
