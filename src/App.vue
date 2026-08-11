<script setup lang="ts">
import { Info } from 'lucide-vue-next'
import DealParameters from './components/DealParameters.vue'
import DealResults from './components/DealResults.vue'
import { useDealCalculator } from './composables/useDealCalculator'

const calculator = useDealCalculator()
</script>

<template>
  <main class="app-shell">
    <header class="app-header">
      <p class="eyebrow">MOEX · срочный рынок</p>
      <h1>Калькулятор сделки для спреда срочный / вечный фьючерс MOEX</h1>
      <p>Оценка доходности сделки с учетом фандинга, займа и комиссий</p>
    </header>

    <DealParameters :calculator="calculator" />
    <DealResults :calculator="calculator" />

    <footer class="formula-note">
      <Info :size="17" aria-hidden="true" />
      <p>
        <span><strong>Short</strong> спреда: вечный фьючерс в Long, фандинг вычитается. <strong>Long</strong> спреда — прибавляется.</span>
        <span>ROI считается от капитала под ГО, годовых — по календарным дням.</span>
      </p>
    </footer>
  </main>
</template>
