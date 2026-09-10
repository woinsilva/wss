<script setup lang="ts">
defineI18nRoute({ paths: { 'pt-BR': '/orcamento', en: '/quote' } })
const { t } = useI18n()
const routes = useSiteRoutes()
useSeoMeta({ title: () => `${t('quote.pageTitle')} — WSS IT`, description: () => t('quote.intro') })
</script>

<template>
  <div class="quote-page section"><div class="container"><Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.quote') }]" /><div class="quote-page__intro"><h1>{{ $t('quote.headline') }}</h1><p>{{ $t('quote.intro') }}</p></div><QuoteForm /></div></div>
</template>

<style scoped>
.quote-page { background: radial-gradient(circle at 75% 5%, rgba(37,99,235,.14), transparent 30%); }.quote-page__intro { max-width: 50rem; margin: var(--space-12) 0 var(--space-10); }.quote-page h1 { font-size: clamp(2.8rem, 6vw, 5rem); }.quote-page__intro p { margin-top: var(--space-5); font-size: var(--font-size-xl); }
</style>
