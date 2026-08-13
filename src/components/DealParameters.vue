<script setup lang="ts">
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
} = props.calculator
</script>

<template>
  <section class="calculator-section" aria-labelledby="parameters-title">
    <div class="section-heading">
      <h2 id="parameters-title">Параметры сделки</h2>
    </div>

    <div class="parameters-grid parameters-grid--top">
      <div class="field-group">
        <label class="field-label" for="days-in-trade">Дней в сделке</label>
        <NumericInput
          id="days-in-trade"
          :model-value="daysInTrade"
          :min="0"
          :max="baseDaysToExpiration"
          :integer="true"
          inputmode="numeric"
          @update:model-value="setDaysInTrade"
        />
        <div class="field-meta">
          <span>Рабочих дней: <strong>{{ workingDays }}</strong></span>
          <button class="text-link" type="button" @click="resetDaysToExpiration">
            До экспирации
          </button>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="funding-rate">Ставка фандинга, ₽/день</label>
        <NumericInput
          id="funding-rate"
          v-model="fundingRate"
          :step="0.0001"
        />
        <div class="preset-links" aria-label="Быстрый выбор ставки фандинга">
          <a
            v-for="preset in dealConfig.fundingPresets"
            :key="preset.label"
            href="#funding-rate"
            :class="{ 'is-active': fundingRate === preset.value }"
            @click.prevent="fundingRate = preset.value"
          >
            {{ preset.label }} {{ formatRate(preset.value) }}
          </a>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="pairs">Пар контрактов</label>
        <NumericInput
          id="pairs"
          :model-value="pairs"
          :min="1"
          :integer="true"
          inputmode="numeric"
          @update:model-value="setPairs"
        />
        <div class="field-meta">
          <span>Целое число от 1</span>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="position-margin">
          ГО по позиции, ₽
          <InfoTooltip text="По правилам MOEX: количество пар × большее ГО из срочного и вечного фьючерсов." />
        </label>
        <NumericInput
          id="position-margin"
          :model-value="positionMargin"
          :min="0"
          :step="100"
          @update:model-value="setPositionMargin"
        />
        <div class="field-meta">
          <span v-if="positionMarginIsManual" class="manual-label">Изменено вручную</span>
          <span v-else>{{ formatMoney(Math.max(dealConfig.futMargin, dealConfig.perpMargin)) }} за пару</span>
          <button class="text-link" type="button" @click="resetPositionMargin">
            По правилам MOEX
          </button>
        </div>
      </div>
    </div>

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
        <label class="field-label" for="spread-exit">Спред выхода, ₽</label>
        <NumericInput
          id="spread-exit"
          :model-value="spreadExit"
          :step="0.1"
          :precision="1"
          @update:model-value="setSpreadExit"
        />
        <div class="field-meta">
          <span>Линейная сходимость к экспирации</span>
          <span v-if="spreadExitIsManual" class="manual-label">Изменено вручную</span>
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Направление сделки</span>
        <output class="direction-card" :class="`direction-card--${metrics.direction.toLowerCase()}`">
          <span class="status-dot" aria-hidden="true" />
          <span>Направление:</span>
          <strong>{{ metrics.direction }}</strong>
        </output>
      </div>
    </div>

    <div class="loan-toggle-area">
      <label class="toggle-control">
        <input v-model="useLoan" type="checkbox" role="switch" />
        <span class="toggle-track" aria-hidden="true"><span /></span>
        <span>
          <strong>Использовать заемный капитал</strong>
          <small>Показать параметры собственного капитала и займа</small>
        </span>
      </label>
    </div>

    <Transition name="reveal">
      <LoanParameters
        v-if="useLoan"
        :own-capital="ownCapital"
        :loan-rate="loanRate"
        :metrics="metrics"
        @update:own-capital="ownCapital = $event"
        @update:loan-rate="loanRate = $event"
      />
    </Transition>
  </section>
</template>
