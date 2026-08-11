<script setup lang="ts">
import { formatLeverage, formatMoney } from '../utils/format'
import NumericInput from './NumericInput.vue'
import type { DealMetrics } from '../composables/useDealCalculator'

defineProps<{
  loanRate: number
  metrics: DealMetrics
}>()

const emit = defineEmits<{
  'update:loanRate': [value: number]
}>()
</script>

<template>
  <div class="loan-box">
    <div class="field-group">
      <span class="field-label">Заемный капитал, ₽</span>
      <output class="readonly-value">{{ formatMoney(metrics.borrowedCapital) }}</output>
    </div>

    <div class="field-group">
      <label class="field-label" for="loan-rate">Ставка займа, % годовых</label>
      <NumericInput
        id="loan-rate"
        :model-value="loanRate"
        :min="0"
        :step="0.1"
        @update:model-value="emit('update:loanRate', $event)"
      />
    </div>

    <div class="field-group">
      <span class="field-label">Стоимость займа в день</span>
      <output class="readonly-value">{{ formatMoney(metrics.loanCostPerDay) }} / день</output>
    </div>

    <div class="leverage-chip" :class="{ 'leverage-chip--muted': metrics.leverage === null }">
      Плечо: {{ formatLeverage(metrics.leverage) }}
    </div>
  </div>
</template>
