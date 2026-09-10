<script setup lang="ts">
interface Faq { question: string, answer: string }
const { tm } = useI18n()
const items = computed(() => tm('faq.items') as unknown as Faq[])
</script>

<template>
  <section class="section"><div class="container faq"><SectionHeading :title="$t('faq.sectionTitle')" /><div><details v-for="item in items" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></div></div></section>
</template>

<style scoped>
.faq { display: grid; grid-template-columns: .8fr 1.2fr; gap: var(--space-16); }
details { border-top: 1px solid var(--color-border); }
details:last-child { border-bottom: 1px solid var(--color-border); }
summary { padding: var(--space-5) 2rem var(--space-5) 0; color: var(--color-text-primary); font-weight: 650; cursor: pointer; }
details p { padding: 0 0 var(--space-5); }
@media (max-width: 760px) { .faq { grid-template-columns: 1fr; gap: var(--space-4); } }
</style>
