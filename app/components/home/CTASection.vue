<script setup lang="ts">
const routes = useSiteRoutes()
const { locale } = useI18n()
const { trackCtaClicked } = useAnalytics()
</script>

<template>
  <section class="cta surface-dark">
    <div class="cta__glow" aria-hidden="true" />
    <div v-reveal class="container cta__inner">
      <div>
        <p class="eyebrow">{{ $t('cta.eyebrow') }}</p>
        <h2>{{ $t('cta.headline') }}</h2>
        <p class="cta__lead">{{ $t('cta.subheadline') }}</p>
      </div>
      <div class="cta__actions">
        <AppButton :to="routes.quote" size="large" @click="trackCtaClicked('footer', '', locale)">
          {{ $t('cta.button') }} <span class="btn__arrow" aria-hidden="true">→</span>
        </AppButton>
        <p>{{ $t('cta.emailLabel') }} <a href="mailto:wssitconsultoria@gmail.com">wssitconsultoria@gmail.com</a></p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: var(--space-24) 0;
}

.cta__glow {
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 60% 90% at 100% 50%, #000, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 60% 90% at 100% 50%, #000, transparent 70%);
}

.cta__inner {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: end;
  gap: var(--space-12);
}

.cta h2 {
  max-width: 40rem;
  margin-top: var(--space-5);
  font-size: clamp(2rem, 4vw, 3rem);
}

.cta__lead {
  max-width: 36rem;
  margin-top: var(--space-5);
  font-size: var(--font-size-lg);
}

.cta__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  justify-self: end;
}

.cta__actions p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.cta__actions a:not(.btn) {
  color: var(--color-text-primary);
  text-decoration: underline;
  text-decoration-color: var(--color-border-hover);
  text-underline-offset: 3px;
}

@media (max-width: 860px) {
  .cta {
    padding: var(--space-16) 0;
  }

  .cta__inner {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .cta__actions {
    justify-self: start;
  }
}

@media (max-width: 480px) {
  .cta__actions,
  .cta__actions .btn {
    width: 100%;
  }
}
</style>
