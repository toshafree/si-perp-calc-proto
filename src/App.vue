<script setup lang="ts">
import DealParameters from './components/DealParameters.vue'
import DealResults from './components/DealResults.vue'
import { useDealCalculator } from './composables/useDealCalculator'

const calculator = useDealCalculator()
</script>

<template>
  <main class="app-shell">
    <header class="app-header">
      <h1>Калькулятор сделки для спреда срочный / вечный фьючерс MOEX</h1>
      <p>Оценка доходности сделки с учетом фандинга, займа и комиссий</p>
    </header>

    <form class="calculator-surface" @submit.prevent>
      <DealParameters :calculator="calculator" />
      <DealResults :calculator="calculator" />
    </form>
  </main>
</template>
