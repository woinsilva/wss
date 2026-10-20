<script setup lang="ts">
interface ProfileRow { label: string, value: string }
const routes = useSiteRoutes()
const { locale } = useI18n()
const { trackCtaClicked } = useAnalytics()
const rows = useTranslatedContent<ProfileRow[]>('hero.profile.rows')
const { t } = useI18n()
// Each word keeps its accent flag so the italic highlight survives the word-by-word entrance.
const words = computed(() => splitAccent(t('hero.headline')).flatMap(part =>
  part.text.split(' ').filter(Boolean).map(text => ({ text, accent: part.accent })),
))
const headline = computed(() => stripAccent(t('hero.headline')))
const scheduleHref = computed(() => `mailto:wssitconsultoria@gmail.com?subject=${encodeURIComponent(t('hero.scheduleSubject'))}`)

const hero = ref<HTMLElement | null>(null)
let frame = 0

function onPointerMove(event: PointerEvent) {
  if (!hero.value || frame) return
  const el = hero.value
  frame = requestAnimationFrame(() => {
    frame = 0
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  })
}

function onScroll() {
  hero.value?.style.setProperty('--scroll', String(Math.min(window.scrollY, 800)))
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(pointer: fine)').matches) {
    hero.value?.addEventListener('pointermove', onPointerMove, { passive: true })
    hero.value?.classList.add('hero--interactive')
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  hero.value?.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section ref="hero" class="hero">
    <div class="hero__backdrop" aria-hidden="true" />
    <div class="hero__glow" aria-hidden="true" />
    <div v-parallax="30" class="hero__aura" aria-hidden="true" />
    <div class="container hero__grid">
      <div class="hero__content">
        <p class="eyebrow rise">{{ $t('hero.eyebrow') }}</p>
        <h1 :aria-label="headline">
          <span v-for="(word, index) in words" :key="`${index}-${word.text}`" class="hero__word rise" aria-hidden="true" :style="{ '--rise-delay': `${120 + index * 45}ms` }"><em v-if="word.accent">{{ word.text }}</em><template v-else>{{ word.text }}</template></span>
        </h1>
        <p class="lead hero__lead rise" style="--rise-delay: 500ms">{{ $t('hero.subheadline') }}</p>
        <div class="hero__actions rise" style="--rise-delay: 620ms">
          <AppButton :to="routes.quote" size="large" @click="trackCtaClicked('hero', '', locale)">
            {{ $t('hero.cta') }} <span class="btn__arrow" aria-hidden="true">→</span>
          </AppButton>
          <a :href="scheduleHref" class="btn btn-secondary btn-lg" @click="trackCtaClicked('hero-schedule', '', locale)">{{ $t('hero.ctaSecondary') }}</a>
        </div>
      </div>

      <aside class="hero__profile rise" style="--rise-delay: 420ms" :aria-label="$t('hero.profile.title')">
        <header>
          <p>{{ $t('hero.profile.title') }}</p>
          <span class="hero__status"><i aria-hidden="true" />{{ $t('hero.profile.status') }}</span>
        </header>
        <dl>
          <div v-for="(row, index) in rows" :key="row.label" class="rise" :style="{ '--rise-delay': `${620 + index * 90}ms` }">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--color-border);
}

.hero__backdrop {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 80% at 85% 20%, #000 10%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 85% 20%, #000 10%, transparent 70%);
  opacity: 0.7;
  transform: translate3d(0, calc(var(--scroll, 0) * 0.15px), 0);
  will-change: transform;
}

.hero__glow {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: radial-gradient(36rem circle at var(--mx, 80%) var(--my, 20%), rgba(37, 99, 235, 0.1), transparent 65%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.hero--interactive .hero__glow {
  opacity: 1;
}

.hero__word {
  display: inline-block;
  margin-right: 0.22em;
}

/* Brand-blue aura behind the profile card, drifting with the scroll (v-parallax). */
.hero__aura {
  position: absolute;
  z-index: -2;
  top: -30%;
  right: -10%;
  width: 60rem;
  height: 60rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.32), rgba(124, 58, 237, 0.12) 45%, transparent 70%);
  pointer-events: none;
}

.hero__word:last-child {
  margin-right: 0;
}

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: center;
  gap: var(--space-16);
  padding-top: clamp(4rem, 9vw, 7.5rem);
  padding-bottom: clamp(4rem, 9vw, 7.5rem);
}

.hero h1 {
  margin-top: var(--space-6);
}

.hero__lead {
  max-width: 38rem;
  margin-top: var(--space-6);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-10);
}

.hero__profile {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-lg);
}

.hero__profile::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--gradient-brand);
  content: '';
}

.hero__profile header {
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.hero__profile header p {
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-success);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.hero__status i {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #12B76A;
  box-shadow: 0 0 0 4px rgba(18, 183, 106, 0.15);
}

.hero__profile dl > div {
  position: relative;
  display: grid;
  gap: var(--space-1);
  padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-md);
  transition:
    transform 0.35s var(--ease-out),
    box-shadow 0.35s var(--ease-out),
    background-color 0.35s var(--ease-out),
    opacity 0.35s var(--ease-out);
}

.hero__profile dl > div:last-child {
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.hero__profile dt {
  transition: color 0.35s var(--ease-out);
}

/* Hovering a row zooms it out of the card while the other rows step back. */
@media (hover: hover) and (pointer: fine) {
  .hero__profile dl:hover > div {
    opacity: 0.55;
  }

  .hero__profile dl > div:hover {
    z-index: 1;
    border-radius: var(--radius-md);
    background: var(--color-bg-primary);
    box-shadow: var(--glow-accent);
    opacity: 1;
    /* User-initiated; with reduced motion the global rule makes it instant instead of animated. */
    transform: scale(1.06);
  }

  .hero__profile dl > div:hover dt {
    color: var(--color-accent);
  }
}

.hero__profile dl > div + div {
  border-top: 1px solid var(--color-border);
}

.hero__profile dt {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero__profile dd {
  color: var(--color-text-primary);
  font-weight: 500;
}

@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr;
    gap: var(--space-12);
  }

  .hero__profile {
    max-width: 34rem;
  }
}

@media (max-width: 480px) {
  .hero__actions .btn {
    width: 100%;
  }
}
</style>
