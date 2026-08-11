<script setup lang="ts">
import { Info } from 'lucide-vue-next'

defineProps<{
  text: string
}>()
</script>

<template>
  <span class="tooltip" tabindex="0" :aria-label="text">
    <Info :size="14" aria-hidden="true" />
    <span class="tooltip__content" role="tooltip">{{ text }}</span>
  </span>
</template>
