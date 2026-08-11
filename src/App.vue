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

      <footer class="formula-note">
        <p>
          <span><strong>Short</strong> спреда: вечный фьючерс в Long, фандинг вычитается. <strong>Long</strong> спреда — прибавляется.</span>
          <span>ROI считается от капитала под ГО, годовых — по календарным дням.</span>
        </p>
      </footer>
    </form>
  </main>
</template>
