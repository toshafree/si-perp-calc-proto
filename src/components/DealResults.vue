<script setup lang="ts">
import type { DealCalculator } from '../composables/useDealCalculator'
import { formatMoney, formatPercent } from '../utils/format'
import InfoTooltip from './InfoTooltip.vue'

const props = defineProps<{
  calculator: DealCalculator
}>()

const { useLoan, metrics } = props.calculator

function signClass(value: number): string {
  if (value > 0) return 'value--positive'
  if (value < 0) return 'value--negative'
  return 'value--neutral'
}
</script>

<template>
  <section class="calculator-section results-section" aria-labelledby="results-title" aria-live="polite">
    <div class="section-heading">
      <h2 id="results-title">Результаты</h2>
    </div>

    <div class="metric-grid">
      <article class="metric-card">
        <span>Доход от сведения спреда</span>
        <strong :class="signClass(metrics.spreadIncome)">{{ formatMoney(metrics.spreadIncome) }}</strong>
      </article>

      <article class="metric-card">
        <span>Фандинг</span>
        <strong :class="signClass(metrics.fundingResult)">{{ formatMoney(metrics.fundingResult) }}</strong>
      </article>

      <article v-if="useLoan" class="metric-card">
        <span>Займ</span>
        <strong :class="signClass(-metrics.loanCost)">{{ formatMoney(-metrics.loanCost) }}</strong>
      </article>

      <article class="metric-card">
        <span>Комиссии</span>
        <strong :class="signClass(-metrics.commission)">{{ formatMoney(-metrics.commission) }}</strong>
      </article>
    </div>

    <div class="summary-panel">
      <article class="summary-item summary-item--primary">
        <span>Результат сделки</span>
        <strong :class="signClass(metrics.dealResult)">{{ formatMoney(metrics.dealResult) }}</strong>
      </article>

      <article class="summary-item">
        <span class="summary-label">
          ROI сделки
          <InfoTooltip text="Результат сделки, деленный на используемую базу капитала." />
        </span>
        <strong :class="signClass(metrics.roi)">{{ formatPercent(metrics.roi) }}</strong>
      </article>

      <article class="summary-item">
        <span class="summary-label">
          Годовых
          <InfoTooltip text="ROI, приведенный к году по календарным дням сделки." />
        </span>
        <strong :class="signClass(metrics.annualizedReturn)">
          {{ formatPercent(metrics.annualizedReturn) }}
        </strong>
      </article>
    </div>
  </section>
</template>
