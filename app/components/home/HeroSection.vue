<script setup lang="ts">
const routes = useSiteRoutes()
</script>

<template>
  <section class="hero">
    <div class="hero__glow hero__glow--one" />
    <div class="hero__glow hero__glow--two" />
    <div class="container hero__grid">
      <div class="hero__content">
        <p class="hero__eyebrow">{{ $t('footer.tagline') }}</p>
        <h1>{{ $t('hero.headline') }}</h1>
        <p class="hero__lead">{{ $t('hero.subheadline') }}</p>
        <div class="hero__actions">
          <AppButton :to="routes.quote" size="large">{{ $t('hero.cta') }}</AppButton>
          <AppButton :to="routes.solutions" variant="secondary" size="large">{{ $t('hero.ctaSecondary') }}</AppButton>
        </div>
      </div>
      <IntegrationVisualization />
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; min-height: calc(100vh - 4.5rem); overflow: hidden; isolation: isolate; }
.hero__grid { display: grid; min-height: calc(100vh - 4.5rem); grid-template-columns: 1.05fr .95fr; align-items: center; gap: var(--space-12); padding-top: var(--space-16); padding-bottom: var(--space-16); }
.hero__content { max-width: 46rem; }
.hero__eyebrow { margin-bottom: var(--space-5); color: var(--color-accent-cyan); font-size: var(--font-size-sm); font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
.hero h1 { font-size: clamp(2.8rem, 6vw, 5.5rem); line-height: 1.02; }
.hero__lead { max-width: 42rem; margin-top: var(--space-6); font-size: clamp(1.05rem, 2vw, 1.3rem); }
.hero__actions { display: flex; flex-wrap: wrap; gap: var(--space-4); margin-top: var(--space-8); }
.hero__glow { position: absolute; z-index: -1; width: 36rem; height: 36rem; border-radius: 50%; filter: blur(100px); opacity: .14; }
.hero__glow--one { top: -15rem; right: -10rem; background: var(--color-accent-cyan); }
.hero__glow--two { bottom: -20rem; left: 25%; background: var(--color-accent-violet); }
@media (max-width: 900px) { .hero__grid { grid-template-columns: 1fr; text-align: center; } .hero__content, .hero__lead { margin-right: auto; margin-left: auto; } .hero__actions { justify-content: center; } }
</style>
