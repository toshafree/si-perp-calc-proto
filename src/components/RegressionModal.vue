<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  regressionTimeframes,
  type RegressionTimeframe,
} from '../utils/dealSettings'
import NumericInput from './NumericInput.vue'

interface RegressionSettings {
  timeframe: RegressionTimeframe
  candles: number
}

const props = defineProps<{
  timeframe: RegressionTimeframe
  candles: number
}>()

const emit = defineEmits<{
  close: []
  apply: [settings: RegressionSettings]
}>()

const timeframe = ref<RegressionTimeframe>(props.timeframe)
const candles = ref(props.candles)
const applyButton = ref<HTMLButtonElement | null>(null)

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

function apply(): void {
  emit('apply', {
    timeframe: timeframe.value,
    candles: Math.max(1, Math.trunc(candles.value)),
  })
}

onMounted(async () => {
  document.body.classList.add('has-modal')
  document.addEventListener('keydown', handleKeydown)
  await nextTick()
  applyButton.value?.focus()
})

onBeforeUnmount(() => {
  document.body.classList.remove('has-modal')
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" role="presentation" @mousedown.self="emit('close')">
      <section
        class="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="regression-modal-title"
      >
        <header class="modal-header">
          <h2 id="regression-modal-title">Расчёт спреда выхода</h2>
          <button class="modal-close" type="button" aria-label="Закрыть" @click="emit('close')">
            ×
          </button>
        </header>

        <div class="modal-fields">
          <div class="field-group">
            <label class="field-label" for="regression-timeframe">Таймфрейм</label>
            <div class="select-wrap">
              <select id="regression-timeframe" v-model="timeframe" class="form-select">
                <option v-for="option in regressionTimeframes" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label" for="regression-candles">Количество свечей</label>
            <NumericInput
              id="regression-candles"
              v-model="candles"
              :min="1"
              :integer="true"
              inputmode="numeric"
            />
          </div>
        </div>

        <footer class="modal-actions">
          <button class="secondary-button" type="button" @click="emit('close')">Отмена</button>
          <button ref="applyButton" class="primary-button" type="button" @click="apply">
            Рассчитать и применить
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
