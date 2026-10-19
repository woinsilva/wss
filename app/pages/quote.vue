<script setup lang="ts">
defineI18nRoute({ paths: { 'pt-BR': '/orcamento', en: '/quote' } })
const { t } = useI18n()
const routes = useSiteRoutes()
const steps = useTranslatedContent<string[]>('quote.asideSteps')
useSeoMeta({ title: () => `${t('quote.pageTitle')} - WSS IT`, description: () => t('quote.subheadline') })
</script>

<template>
  <div class="quote-page">
    <div class="container">
      <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.quote') }]" />
      <div class="quote-page__grid">
        <div class="quote-page__intro">
          <p class="eyebrow">{{ $t('quote.eyebrow') }}</p>
          <h1>{{ $t('quote.headline') }}</h1>
          <p class="lead">{{ $t('quote.subheadline') }}</p>

          <div class="quote-page__next">
            <h2>{{ $t('quote.asideTitle') }}</h2>
            <ol>
              <li v-for="(step, index) in steps" :key="step"><span>{{ index + 1 }}</span>{{ step }}</li>
            </ol>
          </div>

          <p class="quote-page__email">
            {{ $t('quote.asideEmail') }}
            <a href="mailto:wssitconsultoria@gmail.com">wssitconsultoria@gmail.com</a>
          </p>
        </div>
        <QuoteForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.quote-page {
  padding: var(--space-12) 0 var(--space-24);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.quote-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: start;
  gap: var(--space-16);
  margin-top: var(--space-10);
}

.quote-page__intro {
  position: sticky;
  top: calc(var(--header-height) + var(--space-8));
}

.quote-page__intro h1 {
  margin-top: var(--space-5);
  font-size: clamp(2rem, 4vw, 3rem);
}

.quote-page__intro .lead {
  margin-top: var(--space-5);
}

.quote-page__next {
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
}

.quote-page__next h2 {
  font-size: var(--font-size-base);
}

.quote-page__next ol {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-5);
  list-style: none;
}

.quote-page__next li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  color: var(--color-text-primary);
}

.quote-page__next li span {
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

.quote-page__email {
  margin-top: var(--space-8);
  font-size: var(--font-size-sm);
}

@media (max-width: 960px) {
  .quote-page {
    padding-bottom: var(--space-16);
  }

  .quote-page__grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  .quote-page__intro {
    position: static;
  }
}
</style>
