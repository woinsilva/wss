<script setup lang="ts">
defineI18nRoute({ paths: { 'pt-BR': '/sobre', en: '/about' } })
const { t } = useI18n()
const routes = useSiteRoutes()
useSeoMeta({ title: () => `${t('about.pageTitle')} — WSS IT`, description: () => t('about.intro') })
</script>

<template>
  <div><header class="about-hero section"><div class="container"><Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.about') }]" /><p class="about-hero__eyebrow">WSS IT</p><h1>{{ $t('about.headline') }}</h1><p class="about-hero__lead">{{ $t('about.intro') }}</p></div></header><section class="section"><div class="container about-grid"><div><h2>{{ $t('about.mission') }}</h2></div><div><p>{{ $t('about.experience') }}</p><p>{{ $t('about.location') }}</p><AppButton :to="routes.quote">{{ $t('nav.quote') }}</AppButton></div></div></section><FounderSection /><CTASection /></div>
</template>

<style scoped>
.about-hero { background: radial-gradient(circle at 75% 0, rgba(0,209,255,.12), transparent 35%); }.about-hero__eyebrow { margin: var(--space-12) 0 var(--space-4); color: var(--color-accent-cyan); font-weight: 700; letter-spacing: .14em; }.about-hero h1 { max-width: 55rem; font-size: clamp(2.8rem, 6vw, 5rem); }.about-hero__lead { max-width: 50rem; margin-top: var(--space-6); font-size: var(--font-size-xl); }.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); }.about-grid h2 { font-size: var(--font-size-3xl); }.about-grid p + p { margin-top: var(--space-5); }.about-grid .btn { margin-top: var(--space-8); }@media(max-width:700px){.about-grid{grid-template-columns:1fr;}}
</style>
