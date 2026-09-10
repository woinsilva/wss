<script setup lang="ts">
import { solutions } from '~/data/solutions'

defineI18nRoute({ paths: { 'pt-BR': '/solucoes', en: '/solutions' } })
const { tm, t, locale } = useI18n()
const routes = useSiteRoutes()
function content(key: string) { return tm(`solutions.${key}`) as unknown as { title: string, headline: string, description: string } }
function url(solution: typeof solutions[number]) { return `${routes.value.solutions}/${solution.slugs[locale.value as 'pt-BR' | 'en']}` }
useSeoMeta({ title: () => `${t('solutions.pageTitle')} — WSS IT`, description: () => t('solutions.subheadline') })
</script>

<template>
  <div><header class="solution-hero section"><div class="container"><Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.solutions') }]" /><h1>{{ $t('solutions.headline') }}</h1><p>{{ $t('solutions.subheadline') }}</p></div></header><section class="section"><div class="container solution-grid"><NuxtLink v-for="solution in solutions" :key="solution.key" :to="url(solution)" class="solution-card glass-card"><span>{{ solution.key }}</span><h2>{{ content(solution.key).title }}</h2><h3>{{ content(solution.key).headline }}</h3><p>{{ content(solution.key).description }}</p><strong>{{ $t('services.cta') }} →</strong></NuxtLink></div></section><CTASection /></div>
</template>

<style scoped>
.solution-hero { background: radial-gradient(circle at 70% 0, rgba(124,58,237,.18), transparent 40%); }
.solution-hero h1 { margin: var(--space-12) 0 var(--space-5); font-size: clamp(2.8rem, 6vw, 5rem); }
.solution-hero p { max-width: 44rem; font-size: var(--font-size-xl); }
.solution-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
.solution-card { display: block; min-height: 27rem; padding: var(--space-8); color: inherit; }
.solution-card span { color: var(--color-accent-cyan); font-size: var(--font-size-sm); font-weight: 700; text-transform: uppercase; }
.solution-card h2 { margin: var(--space-8) 0 var(--space-3); font-size: var(--font-size-3xl); }
.solution-card h3 { margin-bottom: var(--space-5); color: var(--color-text-secondary); font-size: var(--font-size-xl); }
.solution-card strong { display: block; margin-top: var(--space-8); color: var(--color-accent-cyan); }
@media (max-width: 700px) { .solution-grid { grid-template-columns: 1fr; } }
</style>
