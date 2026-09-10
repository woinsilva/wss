<script setup lang="ts">
import type { ServiceDefinition } from '~/data/services'

interface PageContent { title: string, metaDescription: string, headline: string, description: string, faq?: Array<{ question: string, answer: string }> }
interface CapabilityContent { capabilities: string[] }

const props = defineProps<{ service: ServiceDefinition }>()
const { t, locale } = useI18n()
const routes = useSiteRoutes()
const content = useTranslatedContent<PageContent>(() => `servicesPages.${props.service.translationKey}`)
const source = useTranslatedContent<CapabilityContent>(() => `services.items.${props.service.capabilityKey}`)
const capabilities = computed(() => source.value.capabilities ?? [])
const { trackServiceViewed, trackCtaClicked } = useAnalytics()

useSeoMeta({
  title: () => `${content.value.title} — WSS IT`,
  description: () => content.value.metaDescription,
})

useHead(() => ({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: content.value.title,
  description: content.value.metaDescription,
  provider: { '@type': 'Organization', name: 'WSS IT', url: 'https://wssit.com.br' },
  areaServed: ['Brazil', 'United States'],
}) }] }))

onMounted(() => trackServiceViewed(props.service.slugs[locale.value as 'pt-BR' | 'en'], locale.value))
</script>

<template>
  <article class="service-page">
    <header class="service-hero section">
      <div class="container">
        <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.services'), to: routes.services }, { label: content.title }]" />
        <p class="service-hero__eyebrow">{{ $t('footer.tagline') }}</p>
        <h1>{{ content.headline }}</h1>
        <p class="service-hero__lead">{{ content.description }}</p>
        <AppButton :to="routes.quote" size="large" @click="trackCtaClicked('service_page', service.key, locale)">{{ $t('services.cta') }}</AppButton>
      </div>
    </header>

    <section class="section">
      <div class="container capabilities">
        <SectionHeading :title="$t('tech.sectionTitle')" :description="$t('tech.sectionSubtitle')" />
        <ul><li v-for="capability in capabilities" :key="capability">{{ capability }}</li></ul>
      </div>
    </section>

    <section v-if="content.faq?.length" class="section service-faq">
      <div class="container"><SectionHeading :title="$t('faq.sectionTitle')" /><details v-for="item in content.faq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></div>
    </section>
    <CTASection />
  </article>
</template>

<style scoped>
.service-hero { padding-top: var(--space-20); background: radial-gradient(circle at 80% 0, rgba(37,99,235,.16), transparent 36%); }
.service-hero__eyebrow { margin: var(--space-16) 0 var(--space-4); color: var(--color-accent-cyan); font-size: var(--font-size-sm); font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.service-hero h1 { max-width: 55rem; font-size: clamp(2.6rem, 6vw, 5rem); }
.service-hero__lead { max-width: 45rem; margin: var(--space-6) 0 var(--space-8); font-size: var(--font-size-xl); }
.capabilities ul { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); list-style: none; }
.capabilities li { padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg-surface); color: var(--color-text-secondary); }
.service-faq { background: var(--color-bg-surface); }
.service-faq details { max-width: 52rem; padding: var(--space-5) 0; border-top: 1px solid var(--color-border); }
.service-faq summary { color: var(--color-text-primary); font-weight: 650; cursor: pointer; }
.service-faq p { margin-top: var(--space-3); }
@media (max-width: 800px) { .capabilities ul { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .capabilities ul { grid-template-columns: 1fr; } }
</style>
