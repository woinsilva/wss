<script setup lang="ts">
const areas = useTranslatedContent<string[]>('founder.areas')
const { trackLinkedInClicked } = useAnalytics()
const { locale } = useI18n()
</script>

<template>
  <section class="section founder-section"><div class="container founder-section__grid"><div class="founder-section__monogram" aria-hidden="true">WS</div><div><SectionHeading :title="$t('founder.sectionTitle')" /><h3>{{ $t('founder.name') }}</h3><p class="founder-section__role">{{ $t('founder.role') }}</p><p>{{ $t('founder.bio') }}</p><ul><li v-for="area in areas" :key="area">{{ area }}</li></ul><a :href="$t('founder.linkedinUrl')" target="_blank" rel="noopener" @click="trackLinkedInClicked('founder', locale)">{{ $t('founder.linkedinCta') }} ↗</a></div></div></section>
</template>

<style scoped>
.founder-section { background: var(--color-bg-surface); }
.founder-section__grid { display: grid; grid-template-columns: .7fr 1.3fr; align-items: center; gap: var(--space-16); }
.founder-section__monogram { display: grid; width: min(21rem, 70vw); aspect-ratio: 1; place-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-2xl); background: var(--gradient-subtle); color: var(--color-text-primary); font-size: clamp(4rem, 10vw, 8rem); font-weight: 800; }
.founder-section__role { margin: var(--space-2) 0 var(--space-5); color: var(--color-accent-cyan); }
.founder-section ul { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: var(--space-6) 0; list-style: none; }
.founder-section li { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-full); color: var(--color-text-secondary); font-size: var(--font-size-sm); }
@media (max-width: 760px) { .founder-section__grid { grid-template-columns: 1fr; } }
</style>
