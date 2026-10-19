<script setup lang="ts">
import { featuredServices } from '~/data/services'

interface ServiceCard { title: string, description: string, capabilities: string[] }
const routes = useSiteRoutes()
const serviceLink = useServiceLink()
const content = useTranslatedContent<Record<string, ServiceCard>>('services.items')
const cards = computed(() => featuredServices.map((service, index) => ({
  ...service,
  number: String(index + 1).padStart(2, '0'),
  to: serviceLink(service.key),
  ...content.value[service.content]!,
})))
</script>

<template>
  <section id="servicos" class="section">
    <div class="container">
      <div class="services__head">
        <SectionHeading :eyebrow="$t('services.eyebrow')" :title="$t('services.sectionTitle')" :description="$t('services.sectionSubtitle')" />
        <AppButton :to="routes.services" variant="secondary">{{ $t('services.viewAll') }}</AppButton>
      </div>
      <div class="services__grid">
        <NuxtLink v-for="(card, index) in cards" :key="card.key" v-reveal="(index % 3) * 90" v-spotlight :to="card.to" class="service-card">
          <div class="service-card__top">
            <span class="service-card__icon"><AppIcon :name="card.icon" /></span>
            <span class="service-card__number">{{ card.number }}</span>
          </div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
          <ul class="tag-list">
            <li v-for="capability in card.capabilities.slice(0, 3)" :key="capability" class="tag">{{ capability }}</li>
          </ul>
          <span class="text-link">{{ $t('services.learnMore') }} <span aria-hidden="true">→</span></span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

.services__head .section-heading {
  margin-bottom: 0;
}

.services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
}

.service-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-8);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  color: inherit;
  transition: background-color var(--transition-base);
}

.service-card:hover {
  background: var(--color-bg-surface);
  color: inherit;
}

.service-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service-card__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid var(--color-accent-line);
  border-radius: var(--radius-md);
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.service-card__number {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
}

.service-card h3 {
  margin-top: var(--space-6);
}

.service-card p {
  margin-top: var(--space-3);
  color: var(--color-text-secondary);
}

.service-card .tag-list {
  margin-top: var(--space-5);
}

.service-card .text-link {
  margin-top: auto;
  padding-top: var(--space-6);
  font-size: var(--font-size-sm);
}

@media (max-width: 960px) {
  .services__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 620px) {
  .services__grid {
    grid-template-columns: 1fr;
  }

  .service-card {
    padding: var(--space-6);
  }
}
</style>
