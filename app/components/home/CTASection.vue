<script setup lang="ts">
const routes = useSiteRoutes()
const { locale, t } = useI18n()
const { trackCtaClicked } = useAnalytics()
const scheduleHref = computed(() => `mailto:wssitconsultoria@gmail.com?subject=${encodeURIComponent(t('hero.scheduleSubject'))}`)
</script>

<template>
  <section v-section-in class="cta surface-dark">
    <div v-parallax="25" class="cta__glow" aria-hidden="true" />
    <div class="container cta__inner">
      <p v-reveal class="eyebrow">{{ $t('cta.eyebrow') }}</p>
      <h2 v-reveal-words><AccentText :text="$t('cta.headline')" /></h2>
      <p v-reveal="200" class="cta__lead">{{ $t('cta.subheadline') }}</p>
      <div v-reveal="320" class="cta__actions">
        <AppButton :to="routes.quote" size="large" @click="trackCtaClicked('footer', '', locale)">
          {{ $t('cta.button') }} <span class="btn__arrow" aria-hidden="true">→</span>
        </AppButton>
        <a :href="scheduleHref" class="btn btn-secondary btn-lg" @click="trackCtaClicked('footer-schedule', '', locale)">{{ $t('cta.scheduleButton') }}</a>
      </div>
      <p v-reveal="420" class="cta__email">{{ $t('cta.emailLabel') }} <a href="mailto:wssitconsultoria@gmail.com">wssitconsultoria@gmail.com</a></p>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: clamp(6rem, 13vw, 11rem) 0;
}

.cta__glow {
  position: absolute;
  z-index: -1;
  /* Taller than the section so the parallax never shows an edge. */
  inset: -15% 0;
  background:
    radial-gradient(ellipse 50% 70% at 15% 100%, rgba(37, 99, 235, 0.4), transparent 70%),
    radial-gradient(ellipse 40% 60% at 90% 0%, rgba(124, 58, 237, 0.25), transparent 70%),
    linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
  background-size: auto, auto, 64px 64px, 64px 64px;
}

.cta h2 {
  max-width: 62rem;
  margin-top: var(--space-6);
  font-size: clamp(3rem, 8vw, 6.5rem);
  line-height: 0.98;
}

.cta__lead {
  max-width: 38rem;
  margin-top: var(--space-6);
  font-size: var(--font-size-lg);
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-10);
}

.cta__email {
  margin-top: var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.cta__email a {
  color: var(--color-text-primary);
  text-decoration: underline;
  text-decoration-color: var(--color-border-hover);
  text-underline-offset: 3px;
}

@media (max-width: 480px) {
  .cta__actions .btn {
    width: 100%;
  }
}
</style>
