<script setup lang="ts">
import type { DealCalculator } from '../composables/useDealCalculator'
import { formatMoney, formatPercent } from '../utils/format'

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

    <div class="results-grid results-grid--details">
      <div class="result-item">
        <span>Доход от сведения спреда</span>
        <strong :class="signClass(metrics.spreadIncome)">{{ formatMoney(metrics.spreadIncome) }}</strong>
      </div>

      <div class="result-item">
        <span>Фандинг</span>
        <strong :class="signClass(metrics.fundingResult)">{{ formatMoney(metrics.fundingResult) }}</strong>
      </div>

      <div v-if="useLoan" class="result-item">
        <span>Займ</span>
        <strong :class="signClass(-metrics.loanCost)">{{ formatMoney(-metrics.loanCost) }}</strong>
      </div>

      <div class="result-item">
        <span>Комиссии</span>
        <strong :class="signClass(-metrics.commission)">{{ formatMoney(-metrics.commission) }}</strong>
      </div>
    </div>

    <div class="results-grid results-grid--summary">
      <div class="result-item result-item--primary">
        <span>Результат сделки</span>
        <strong :class="signClass(metrics.dealResult)">{{ formatMoney(metrics.dealResult) }}</strong>
      </div>

      <div class="result-item result-item--summary">
        <span>ROI сделки</span>
        <strong :class="signClass(metrics.roi)">{{ formatPercent(metrics.roi) }}</strong>
      </div>

      <div class="result-item result-item--summary">
        <span>Годовых</span>
        <strong :class="signClass(metrics.annualizedReturn)">
          {{ formatPercent(metrics.annualizedReturn) }}
        </strong>
      </div>
    </div>
  </section>
</template>
