<script setup lang="ts">
const routes = useSiteRoutes()
const items = useTranslatedContent<string[]>('customSoftware.items')
</script>

<template>
  <section class="section feature-section">
    <div class="container feature-section__grid">
      <div><SectionHeading eyebrow="Custom software" :title="$t('customSoftware.sectionTitle')" :description="$t('customSoftware.sectionSubtitle')" /><AppButton :to="routes.quote">{{ $t('customSoftware.cta') }}</AppButton></div>
      <ul class="capability-cloud"><li v-for="item in items" :key="item">{{ item }}</li></ul>
    </div>
  </section>
</template>

<style scoped>
.feature-section__grid { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: var(--space-16); }
.capability-cloud { display: flex; flex-wrap: wrap; gap: var(--space-3); list-style: none; }
.capability-cloud li { padding: var(--space-3) var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-full); background: var(--color-bg-surface); color: var(--color-text-secondary); }
@media (max-width: 760px) { .feature-section__grid { grid-template-columns: 1fr; gap: var(--space-8); } }
</style>
