<script setup lang="ts">
import { services } from '~/data/services'

defineI18nRoute({ paths: { 'pt-BR': '/servicos', en: '/services' } })
const { tm, t, locale } = useI18n()
const routes = useSiteRoutes()

function content(service: typeof services[number]) {
  return tm(`servicesPages.${service.translationKey}`) as unknown as { title: string, description: string }
}
function url(service: typeof services[number]) {
  return `${routes.value.services}/${service.slugs[locale.value as 'pt-BR' | 'en']}`
}

useSeoMeta({ title: () => `${t('services.sectionTitle')} — WSS IT`, description: () => t('services.sectionSubtitle') })
</script>

<template>
  <div>
    <header class="page-hero section"><div class="container"><Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.services') }]" /><h1>{{ $t('services.sectionTitle') }}</h1><p>{{ $t('services.sectionSubtitle') }}</p></div></header>
    <section class="section"><div class="container service-list"><NuxtLink v-for="service in services" :key="service.key" :to="url(service)" class="glass-card service-list__item"><span>{{ service.key.replaceAll('-', ' ') }}</span><h2>{{ content(service).title }}</h2><p>{{ content(service).description }}</p><strong>{{ $t('services.cta') }} →</strong></NuxtLink></div></section>
    <CTASection />
  </div>
</template>

<style scoped>
.page-hero { background: radial-gradient(circle at 75% 0, rgba(0,209,255,.12), transparent 35%); }
.page-hero h1 { max-width: 50rem; margin-top: var(--space-12); font-size: clamp(2.8rem, 6vw, 5rem); }
.page-hero p { max-width: 42rem; margin-top: var(--space-5); font-size: var(--font-size-xl); }
.service-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.service-list__item { display: block; padding: var(--space-6); color: inherit; }
.service-list__item > span { color: var(--color-accent-cyan); font-size: var(--font-size-xs); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.service-list h2 { margin: var(--space-4) 0; font-size: var(--font-size-xl); }
.service-list strong { display: block; margin-top: var(--space-6); color: var(--color-accent-cyan); font-size: var(--font-size-sm); }
@media (max-width: 850px) { .service-list { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .service-list { grid-template-columns: 1fr; } }
</style>
