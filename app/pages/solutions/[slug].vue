<script setup lang="ts">
import { findSolutionBySlug } from '~/data/solutions'

defineI18nRoute({ paths: { 'pt-BR': '/solucoes/[slug]', en: '/solutions/[slug]' } })
const route = useRoute()
const { tm, t } = useI18n()
const routes = useSiteRoutes()
const solution = computed(() => findSolutionBySlug(String(route.params.slug)))
if (!solution.value) throw createError({ statusCode: 404, statusMessage: 'Solution not found' })
const content = computed(() => tm(`solutions.${solution.value?.key}`) as unknown as { title: string, headline: string, description: string, capabilities: string[] })
const setI18nParams = useSetI18nParams()
setI18nParams({ 'pt-BR': { slug: solution.value.slugs['pt-BR'] }, en: { slug: solution.value.slugs.en } })
useSeoMeta({ title: () => `${content.value.title} — WSS IT`, description: () => content.value.description })
</script>

<template>
  <article><header class="detail-hero section"><div class="container"><Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.solutions'), to: routes.solutions }, { label: content.title }]" /><p class="detail-hero__eyebrow">{{ content.title }}</p><h1>{{ content.headline }}</h1><p class="detail-hero__lead">{{ content.description }}</p><AppButton :to="routes.quote" size="large">{{ $t('nav.quote') }}</AppButton></div></header><section class="section"><div class="container"><SectionHeading :title="$t('tech.sectionTitle')" /><ul class="solution-capabilities"><li v-for="item in content.capabilities" :key="item">{{ item }}</li></ul></div></section><CTASection /></article>
</template>

<style scoped>
.detail-hero { min-height: 40rem; background: radial-gradient(circle at 75% 20%, rgba(124,58,237,.18), transparent 35%); }
.detail-hero__eyebrow { margin: var(--space-12) 0 var(--space-4); color: var(--color-accent-cyan); font-weight: 700; }
.detail-hero h1 { max-width: 55rem; font-size: clamp(2.8rem, 6vw, 5rem); }
.detail-hero__lead { max-width: 48rem; margin: var(--space-6) 0 var(--space-8); font-size: var(--font-size-xl); }
.solution-capabilities { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); list-style: none; }
.solution-capabilities li { padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg-surface); color: var(--color-text-secondary); }
@media (max-width: 700px) { .solution-capabilities { grid-template-columns: 1fr; } }
</style>
