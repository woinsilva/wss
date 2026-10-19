<script setup lang="ts">
import { services } from '~/data/services'

defineI18nRoute({ paths: { 'pt-BR': '/servicos', en: '/services' } })
const { t } = useI18n()
const routes = useSiteRoutes()
const serviceLink = useServiceLink()
const pageContent = useTranslatedContent<Record<string, { title: string, description: string }>>('servicesPages')

const items = computed(() => services.map((service, index) => ({
  key: service.key,
  number: String(index + 1).padStart(2, '0'),
  to: serviceLink(service.key),
  ...pageContent.value[service.translationKey]!,
})))

useSeoMeta({ title: () => `${t('servicesIndex.title')} - WSS IT`, description: () => t('servicesIndex.lead') })
</script>

<template>
  <div>
    <header class="page-hero">
      <div class="container">
        <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.services') }]" />
        <p class="eyebrow">{{ $t('servicesIndex.eyebrow') }}</p>
        <h1>{{ $t('servicesIndex.title') }}</h1>
        <p class="lead">{{ $t('servicesIndex.lead') }}</p>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <ul class="service-list">
          <li v-for="(item, index) in items" :key="item.key" v-reveal="Math.min(index, 4) * 60">
            <NuxtLink :to="item.to" class="service-row">
              <span class="service-row__number">{{ item.number }}</span>
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <span class="service-row__arrow" aria-hidden="true"><AppIcon name="arrow" /></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <ProcessSection />
    <CTASection />
  </div>
</template>

<style scoped>
.service-list {
  border-top: 1px solid var(--color-border);
  list-style: none;
}

.service-list li {
  border-bottom: 1px solid var(--color-border);
}

.service-row {
  display: grid;
  grid-template-columns: 4rem minmax(0, 5fr) minmax(0, 6fr) 2.75rem;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-8) var(--space-4);
  color: inherit;
  transition: background-color var(--transition-base);
}

.service-row:hover {
  background: var(--color-bg-surface);
  color: inherit;
}

.service-row__number {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.service-row h2 {
  font-size: var(--font-size-xl);
  letter-spacing: -0.015em;
}

.service-row p {
  color: var(--color-text-secondary);
}

.service-row__arrow {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text-primary);
  transition: background-color var(--transition-base), border-color var(--transition-base), color var(--transition-base);
}

.service-row:hover .service-row__arrow {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: #fff;
}

@media (max-width: 860px) {
  .service-row {
    grid-template-columns: 3rem minmax(0, 1fr) 2.75rem;
    gap: var(--space-2) var(--space-4);
    padding: var(--space-6) 0;
  }

  .service-row__number {
    grid-row: span 2;
    align-self: start;
    padding-top: 0.2rem;
  }

  .service-row p {
    grid-column: 2;
    grid-row: 2;
  }

  .service-row__arrow {
    grid-column: 3;
    grid-row: 1 / span 2;
  }
}
</style>
