<script setup lang="ts">
const routes = useSiteRoutes()
const { locale } = useI18n()
const { trackCtaClicked } = useAnalytics()
</script>

<template>
  <section class="cta-section section">
    <div class="container">
      <div class="cta-section__panel gradient-border">
        <p>{{ $t('footer.tagline') }}</p>
        <h2>{{ $t('cta.headline') }}</h2>
        <p>{{ $t('cta.subheadline') }}</p>
        <AppButton :to="routes.quote" size="large" @click="trackCtaClicked('footer', '', locale)">
          {{ $t('cta.button') }}
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section__panel { overflow: hidden; padding: clamp(2rem, 7vw, 5rem); border-radius: var(--radius-2xl); background: radial-gradient(circle at 15% 20%, rgba(0,209,255,.14), transparent 35%), var(--color-bg-surface); text-align: center; }
.cta-section__panel > p:first-child { color: var(--color-accent-cyan); font-size: var(--font-size-sm); font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.cta-section h2 { max-width: 50rem; margin: var(--space-4) auto; font-size: clamp(2rem, 5vw, 4rem); }
.cta-section__panel > p:not(:first-child) { max-width: 42rem; margin: 0 auto var(--space-8); font-size: var(--font-size-lg); }
</style>
