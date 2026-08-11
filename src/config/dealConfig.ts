export const dealConfig = {
  expirationDate: '2026-09-17',
  marginPerPair: 24_700,
  commissionPerContract: 0.45,
  defaultOwnCapital: 500_000,
  defaultLoanRate: 21,
  defaultFundingRate: 0.012,
  defaultPairs: 1,
  defaultEntrySpread: 645,
  fundingPresets: [
    { label: 'Средняя за месяц', value: 0.012 },
    { label: 'Средняя за 10 дней', value: 0.0154 },
    { label: 'Последний день', value: 0.03 },
  ],
} as const
