<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  id: string
  modelValue: number
  min?: number
  max?: number
  step?: number
  integer?: boolean
  precision?: number
  inputmode?: 'numeric' | 'decimal'
}>(), {
  step: 1,
  integer: false,
  inputmode: 'decimal',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const textValue = ref(String(props.modelValue))
const isFocused = ref(false)

function formatTextValue(value: number): string {
  return props.precision === undefined ? String(value) : value.toFixed(props.precision)
}

textValue.value = formatTextValue(props.modelValue)

watch(() => props.modelValue, (value) => {
  if (!isFocused.value || Number(textValue.value.replace(',', '.')) !== value) {
    textValue.value = formatTextValue(value)
  }
})

function normalize(value: number): number {
  let result = props.integer ? Math.trunc(value) : value

  if (props.precision !== undefined) {
    const multiplier = 10 ** props.precision
    result = Math.round((result + Number.EPSILON) * multiplier) / multiplier
  }

  if (props.min !== undefined) result = Math.max(props.min, result)
  if (props.max !== undefined) result = Math.min(props.max, result)

  return result
}

function handleInput(event: Event): void {
  const rawValue = (event.target as HTMLInputElement).value
  textValue.value = rawValue
  const parsed = Number(rawValue.replace(',', '.'))

  if (rawValue.trim() !== '' && Number.isFinite(parsed)) {
    emit('update:modelValue', normalize(parsed))
  }
}

function handleBlur(): void {
  isFocused.value = false
  const parsed = Number(textValue.value.replace(',', '.'))

  if (textValue.value.trim() === '' || !Number.isFinite(parsed)) {
    textValue.value = formatTextValue(props.modelValue)
    return
  }

  const normalized = normalize(parsed)
  textValue.value = formatTextValue(normalized)
  emit('update:modelValue', normalized)
}
</script>

<template>
  <input
    :id="id"
    class="numeric-input"
    type="text"
    :value="textValue"
    :inputmode="inputmode"
    autocomplete="off"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="modelValue"
    @focus="isFocused = true"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>
