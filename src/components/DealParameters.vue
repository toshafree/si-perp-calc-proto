<script setup lang="ts">
import {
  CalendarDays,
  Minus,
  RotateCcw,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from 'lucide-vue-next'
import { dealConfig } from '../config/dealConfig'
import type { DealCalculator } from '../composables/useDealCalculator'
import { formatMoney, formatRate } from '../utils/format'
import InfoTooltip from './InfoTooltip.vue'
import LoanParameters from './LoanParameters.vue'
import NumericInput from './NumericInput.vue'

const props = defineProps<{
  calculator: DealCalculator
}>()

const {
  baseDaysToExpiration,
  daysInTrade,
  workingDays,
  fundingRate,
  pairs,
  ownCapital,
  useLoan,
  loanRate,
  spreadEntry,
  spreadExit,
  spreadExitIsManual,
  metrics,
  setDaysInTrade,
  resetDaysToExpiration,
  setSpreadEntry,
  setSpreadExit,
} = props.calculator
</script>

<template>
  <section class="panel" aria-labelledby="parameters-title">
    <div class="section-heading">
      <span class="section-heading__icon"><SlidersHorizontal :size="19" /></span>
      <h2 id="parameters-title">Параметры сделки</h2>
    </div>

    <div class="parameters-grid parameters-grid--top">
      <div class="parameter-cell">
        <div class="field-heading">
          <label class="field-label" for="days-in-trade">Дней в сделке</label>
          <button class="reset-button" type="button" @click="resetDaysToExpiration">
            <RotateCcw :size="13" />
            До экспирации
          </button>
        </div>
        <div class="inline-fields">
          <div class="input-with-icon">
            <NumericInput
              id="days-in-trade"
              :model-value="daysInTrade"
              :min="0"
              :max="baseDaysToExpiration"
              :integer="true"
              inputmode="numeric"
              @update:model-value="setDaysInTrade"
            />
            <CalendarDays :size="17" aria-hidden="true" />
          </div>
          <output class="readonly-value readonly-value--compact">
            Рабочих дней: <strong>{{ workingDays }}</strong>
          </output>
        </div>
      </div>

      <div class="parameter-cell">
        <label class="field-label" for="funding-rate">Ставка фандинга, ₽/день</label>
        <div class="funding-control">
          <NumericInput
            id="funding-rate"
            v-model="fundingRate"
            :step="0.0001"
          />
          <div class="preset-list" aria-label="Быстрый выбор ставки фандинга">
            <button
              v-for="preset in dealConfig.fundingPresets"
              :key="preset.label"
              class="preset-button"
              :class="{ 'preset-button--active': fundingRate === preset.value }"
              type="button"
              @click="fundingRate = preset.value"
            >
              <span>{{ preset.label }}</span>
              <strong>{{ formatRate(preset.value) }}</strong>
            </button>
          </div>
        </div>
      </div>

      <div class="parameter-cell">
        <label class="field-label" for="pairs">Пар контрактов</label>
        <div class="inline-fields">
          <NumericInput
            id="pairs"
            v-model="pairs"
            :min="1"
            :integer="true"
            inputmode="numeric"
          />
          <output class="readonly-value readonly-value--compact">
            <span class="output-label">
              Общее ГО
              <InfoTooltip text="Гарантийное обеспечение: количество пар × 24 700 ₽." />
            </span>
            <strong>{{ formatMoney(metrics.totalMargin) }}</strong>
          </output>
        </div>
      </div>
    </div>

    <div class="capital-row">
      <div class="field-group capital-field">
        <label class="field-label" for="own-capital">Собственный капитал, ₽</label>
        <NumericInput id="own-capital" v-model="ownCapital" :min="0" :step="1000" />
      </div>

      <div class="loan-toggle-area">
        <label class="toggle-control">
          <input v-model="useLoan" type="checkbox" role="switch" />
          <span class="toggle-track" aria-hidden="true"><span /></span>
          <span>
            <strong>Использовать заемный капитал</strong>
            <small>Займ покрывает недостающее ГО</small>
          </span>
        </label>
      </div>
    </div>

    <Transition name="reveal">
      <LoanParameters
        v-if="useLoan"
        :loan-rate="loanRate"
        :metrics="metrics"
        @update:loan-rate="loanRate = $event"
      />
    </Transition>

    <div class="parameters-grid parameters-grid--spread">
      <div class="field-group">
        <label class="field-label" for="spread-entry">Спред входа, ₽</label>
        <NumericInput
          id="spread-entry"
          :model-value="spreadEntry"
          @update:model-value="setSpreadEntry"
        />
      </div>

      <div class="field-group">
        <div class="field-heading">
          <label class="field-label" for="spread-exit">Спред выхода, ₽</label>
          <span v-if="spreadExitIsManual" class="manual-chip">Вручную</span>
        </div>
        <NumericInput
          id="spread-exit"
          :model-value="spreadExit"
          @update:model-value="setSpreadExit"
        />
        <p class="field-hint">Автопересчет по линейной сходимости к 0 к экспирации</p>
      </div>

      <div class="direction-card" :class="`direction-card--${metrics.direction.toLowerCase()}`">
        <TrendingDown v-if="metrics.direction === 'Short'" :size="20" />
        <TrendingUp v-else-if="metrics.direction === 'Long'" :size="20" />
        <Minus v-else :size="20" />
        <span>Направление сделки:</span>
        <strong>{{ metrics.direction }}</strong>
      </div>
    </div>
  </section>
</template>
