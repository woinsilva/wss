<script setup lang="ts">
const { tm } = useI18n()
const items = computed(() => tm('ai.items') as unknown as string[])
</script>

<template>
  <section class="section ai-section">
    <div class="container ai-section__grid">
      <div class="ai-section__orb" aria-hidden="true"><span>AI</span><i /><i /><i /></div>
      <div><SectionHeading eyebrow="Applied AI" :title="$t('ai.sectionTitle')" :description="$t('ai.sectionSubtitle')" /><ul><li v-for="item in items" :key="item">{{ item }}</li></ul></div>
    </div>
  </section>
</template>

<style scoped>
.ai-section { overflow: hidden; background: linear-gradient(135deg, rgba(37,99,235,.08), rgba(124,58,237,.08)); }
.ai-section__grid { display: grid; grid-template-columns: .75fr 1.25fr; align-items: center; gap: var(--space-16); }
.ai-section__orb { position: relative; display: grid; width: min(22rem, 70vw); aspect-ratio: 1; place-items: center; margin: auto; border: 1px solid rgba(0,209,255,.25); border-radius: 50%; background: radial-gradient(circle, rgba(0,209,255,.2), transparent 67%); }
.ai-section__orb::before, .ai-section__orb::after { position: absolute; border: 1px solid var(--color-border); border-radius: 50%; content: ''; inset: 14%; }
.ai-section__orb::after { inset: 29%; border-color: rgba(124,58,237,.4); }
.ai-section__orb span { z-index: 1; font-size: 4rem; font-weight: 800; background: var(--gradient-brand); background-clip: text; color: transparent; }
.ai-section ul { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); list-style: none; }
.ai-section li { padding: var(--space-3); border-left: 2px solid var(--color-accent-blue); color: var(--color-text-secondary); }
@media (max-width: 760px) { .ai-section__grid { grid-template-columns: 1fr; } .ai-section ul { grid-template-columns: 1fr; } }
</style>
