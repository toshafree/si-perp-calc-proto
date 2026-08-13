export const dealConfig = {
  expirationDate: '2026-09-17',
  futMargin: 13_054,
  perpMargin: 11_646,
  commissionPerContract: 0.45,
  defaultOwnCapital: 500_000,
  defaultLoanRate: 21,
  defaultFundingRate: 0.012,
  fundingMultiplier: 1_000,
  defaultPairs: 1,
  defaultEntrySpread: 645,
  fundingPresets: [
    { label: 'Средняя за месяц', value: 0.012 },
    { label: 'Средняя за 10 дней', value: 0.0154 },
    { label: 'Последний день', value: 0.03 },
  ],
} as const
