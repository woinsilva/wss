<script setup lang="ts">
interface Step { number: string, title: string, description: string }
const { tm } = useI18n()
const steps = computed(() => tm('process.steps') as unknown as Step[])
</script>

<template>
  <section class="section"><div class="container"><SectionHeading :title="$t('process.sectionTitle')" /><ol class="process"><li v-for="step in steps" :key="step.number"><span>{{ step.number }}</span><h3>{{ step.title }}</h3><p>{{ step.description }}</p></li></ol></div></section>
</template>

<style scoped>
.process { display: grid; grid-template-columns: repeat(5, 1fr); list-style: none; counter-reset: steps; }
.processless { display: none; }
.process li { position: relative; padding: var(--space-6); border-top: 1px solid var(--color-border); }
.process li::before { position: absolute; top: -4px; left: 0; width: 7px; height: 7px; border-radius: 50%; background: var(--color-accent-cyan); content: ''; box-shadow: var(--shadow-glow-cyan); }
.process span { color: var(--color-accent-cyan); font-size: var(--font-size-sm); font-weight: 700; }
.process h3 { margin: var(--space-4) 0 var(--space-3); font-size: var(--font-size-lg); }
.process p { font-size: var(--font-size-sm); }
@media (max-width: 900px) { .process { grid-template-columns: 1fr; } }
</style>
