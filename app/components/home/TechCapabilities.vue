<script setup lang="ts">
interface Category { title: string, items: string[] }
const { tm } = useI18n()
const categories = computed(() => Object.values(tm('tech.categories') as unknown as Record<string, Category>))
</script>

<template>
  <section class="section"><div class="container"><SectionHeading :title="$t('tech.sectionTitle')" :description="$t('tech.sectionSubtitle')" /><div class="tech-grid"><article v-for="category in categories" :key="category.title" class="tech-card"><h3>{{ category.title }}</h3><p>{{ category.items.join(' · ') }}</p></article></div></div></section>
</template>

<style scoped>
.tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
.tech-card { padding: var(--space-5); border-top: 1px solid var(--color-border); }
.tech-card h3 { margin-bottom: var(--space-3); color: var(--color-accent-cyan); font-size: var(--font-size-base); }
.tech-card p { font-size: var(--font-size-sm); }
@media (max-width: 900px) { .tech-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .tech-grid { grid-template-columns: 1fr; } }
</style>
