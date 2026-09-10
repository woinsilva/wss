<script setup lang="ts">
interface Study { title: string, problem: string, solution: string, technologies: string[] }
const { tm } = useI18n()
const studies = computed(() => Object.values(tm('cases.items') as unknown as Record<string, Study>))
</script>

<template>
  <section class="section cases"><div class="container"><SectionHeading :title="$t('cases.sectionTitle')" :description="$t('cases.sectionSubtitle')" /><div class="cases__grid"><article v-for="study in studies" :key="study.title" class="glass-card case"><h3>{{ study.title }}</h3><p><strong>Context</strong>{{ study.problem }}</p><p><strong>Engineering</strong>{{ study.solution }}</p><ul><li v-for="tech in study.technologies" :key="tech">{{ tech }}</li></ul></article></div></div></section>
</template>

<style scoped>
.cases { background: linear-gradient(180deg, transparent, rgba(37,99,235,.05)); }
.cases__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.case { padding: var(--space-6); }
.case h3 { margin-bottom: var(--space-6); font-size: var(--font-size-xl); }
.case p + p { margin-top: var(--space-5); }
.case strong { display: block; margin-bottom: var(--space-2); color: var(--color-accent-cyan); font-size: var(--font-size-xs); letter-spacing: .1em; text-transform: uppercase; }
.case ul { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-6); list-style: none; }
.case li { color: var(--color-text-muted); font-size: var(--font-size-xs); }
@media (max-width: 850px) { .cases__grid { grid-template-columns: 1fr; } }
</style>
