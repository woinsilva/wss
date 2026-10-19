<script setup lang="ts">
import type { ServiceDefinition } from '~/data/services'

interface PageContent { title: string, metaDescription: string, headline: string, description: string, faq?: Array<{ question: string, answer: string }> }
interface CapabilityContent { capabilities: string[] }
interface ProofItem { value: string, label: string }

const props = defineProps<{ service: ServiceDefinition }>()
const { t, locale } = useI18n()
const routes = useSiteRoutes()
const config = useRuntimeConfig()
const content = useTranslatedContent<PageContent>(() => `servicesPages.${props.service.translationKey}`)
const source = useTranslatedContent<CapabilityContent>(() => `services.items.${props.service.capabilityKey}`)
const startSteps = useTranslatedContent<string[]>('serviceDetail.startSteps')
const proof = useTranslatedContent<ProofItem[]>('proof.items')
const capabilities = computed(() => source.value.capabilities ?? [])
const { trackServiceViewed, trackCtaClicked } = useAnalytics()

useSeoMeta({
  title: () => `${content.value.title} - WSS IT`,
  description: () => content.value.metaDescription,
})

useHead(() => ({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: content.value.title,
  description: content.value.metaDescription,
  provider: { '@type': 'Organization', name: 'WSS IT', url: config.public.siteUrl },
  areaServed: ['Brazil', 'United States'],
}) }] }))

onMounted(() => trackServiceViewed(props.service.slugs[locale.value as 'pt-BR' | 'en'], locale.value))
</script>

<template>
  <article class="service-page">
    <header class="page-hero">
      <div class="container service-hero">
        <div>
          <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.services'), to: routes.services }, { label: content.title }]" />
          <p class="eyebrow">{{ content.title }}</p>
          <h1>{{ content.headline }}</h1>
          <p class="lead">{{ content.description }}</p>
          <div class="service-hero__actions">
            <AppButton :to="routes.quote" size="large" @click="trackCtaClicked('service_page', service.key, locale)">
              {{ $t('services.cta') }} <span class="btn__arrow" aria-hidden="true">→</span>
            </AppButton>
          </div>
        </div>
        <aside class="service-hero__aside">
          <h2>{{ $t('serviceDetail.startTitle') }}</h2>
          <ol>
            <li v-for="(step, index) in startSteps" :key="step"><span>{{ index + 1 }}</span>{{ step }}</li>
          </ol>
        </aside>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <SectionHeading :title="$t('serviceDetail.capabilitiesTitle')" :description="$t('serviceDetail.capabilitiesSubtitle')" />
        <ul class="capabilities">
          <li v-for="(capability, index) in capabilities" :key="capability" v-reveal="(index % 4) * 70"><AppIcon name="check" />{{ capability }}</li>
        </ul>
      </div>
    </section>

    <section class="proof surface-dark">
      <div class="container">
        <h2 class="proof__title">{{ $t('serviceDetail.proofTitle') }}</h2>
        <ul class="proof__list">
          <li v-for="item in proof" :key="item.label"><strong>{{ item.value }}</strong><span>{{ item.label }}</span></li>
        </ul>
      </div>
    </section>

    <section v-if="content.faq?.length" class="section">
      <div class="container service-faq">
        <SectionHeading :title="$t('serviceDetail.faqTitle')" />
        <div class="faq-list">
          <details v-for="item in content.faq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details>
        </div>
      </div>
    </section>

    <CTASection />
  </article>
</template>

<style scoped>
.service-hero {
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
  align-items: end;
  gap: var(--space-16);
}

.service-hero__actions {
  margin-top: var(--space-10);
}

.service-hero__aside {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-md);
}

.service-hero__aside h2 {
  font-size: var(--font-size-base);
}

.service-hero__aside ol {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-5);
  list-style: none;
  font-size: var(--font-size-sm);
}

.service-hero__aside li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  color: var(--color-text-primary);
}

.service-hero__aside li span {
  display: grid;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
}

.capabilities {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  list-style: none;
}

.capabilities li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-weight: 500;
}

.capabilities :deep(.app-icon) {
  color: var(--color-accent);
}

.proof {
  padding: var(--space-16) 0;
}

.proof__title {
  margin-bottom: var(--space-8);
  color: var(--color-text-muted);
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.proof__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
  list-style: none;
}

.proof__list li {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.proof__list strong {
  font-family: var(--font-heading);
  font-size: var(--font-size-3xl);
  letter-spacing: -0.03em;
}

.proof__list span {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.service-faq {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: var(--space-16);
}

@media (max-width: 960px) {
  .service-hero,
  .service-faq {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  .service-faq {
    gap: 0;
  }

  .service-hero__aside {
    max-width: 30rem;
  }

  .capabilities {
    grid-template-columns: repeat(2, 1fr);
  }

  .proof__list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .capabilities {
    grid-template-columns: 1fr;
  }
}
</style>
