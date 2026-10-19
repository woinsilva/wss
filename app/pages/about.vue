<script setup lang="ts">
interface Principle { title: string, description: string }
interface Role { period: string, company: string, role: string, description: string }

defineI18nRoute({ paths: { 'pt-BR': '/sobre', en: '/about' } })
const { t, locale } = useI18n()
const routes = useSiteRoutes()
const { trackLinkedInClicked } = useAnalytics()
const approach = useTranslatedContent<Principle[]>('about.approach')
const timeline = useTranslatedContent<Role[]>('about.timeline')
const education = useTranslatedContent<string[]>('about.education')
const languages = useTranslatedContent<string[]>('about.languages')

useSeoMeta({ title: () => `${t('about.pageTitle')} - WSS IT`, description: () => t('about.intro') })

// The accent line of the timeline "draws" itself as the visitor scrolls through it.
const timelineEl = ref<HTMLElement | null>(null)
let frame = 0
function updateTimeline() {
  frame = 0
  const el = timelineEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const progress = (window.innerHeight * 0.6 - rect.top) / rect.height
  el.style.setProperty('--progress', String(Math.min(Math.max(progress, 0), 1)))
}
function onScroll() {
  if (!frame) frame = requestAnimationFrame(updateTimeline)
}
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timelineEl.value?.classList.add('timeline--animated')
  updateTimeline()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div>
    <header class="page-hero">
      <div class="container">
        <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: t('breadcrumbs.about') }]" />
        <p class="eyebrow">{{ $t('about.eyebrow') }}</p>
        <h1>{{ $t('about.headline') }}</h1>
        <p class="lead">{{ $t('about.intro') }}</p>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <SectionHeading :title="$t('about.approachTitle')" />
        <div class="approach">
          <article v-for="(item, index) in approach" :key="item.title" v-reveal="index * 100">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section surface-subtle career">
      <div class="container career__grid">
        <div>
          <SectionHeading :eyebrow="$t('about.timelineEyebrow')" :title="$t('about.timelineTitle')" :description="$t('about.timelineSubtitle')" />
          <ol ref="timelineEl" class="timeline">
            <li v-for="item in timeline" :key="item.company + item.period" v-reveal>
              <p class="timeline__period">{{ item.period }}</p>
              <h3>{{ item.company }}</h3>
              <p class="timeline__role">{{ item.role }}</p>
              <p>{{ item.description }}</p>
            </li>
          </ol>
        </div>

        <aside class="career__aside">
          <div class="facts">
            <h3>{{ $t('about.educationTitle') }}</h3>
            <ul><li v-for="item in education" :key="item">{{ item }}</li></ul>
          </div>
          <div class="facts">
            <h3>{{ $t('about.languagesTitle') }}</h3>
            <ul><li v-for="item in languages" :key="item">{{ item }}</li></ul>
          </div>
          <div class="facts">
            <h3>{{ $t('about.companyTitle') }}</h3>
            <ul>
              <li>{{ $t('footer.company') }}</li>
              <li>{{ $t('footer.cnpj') }}</li>
              <li>{{ $t('about.location') }}</li>
            </ul>
          </div>
          <a :href="$t('founder.linkedinUrl')" target="_blank" rel="noopener" class="btn btn-secondary" @click="trackLinkedInClicked('about', locale)">
            <AppIcon name="linkedin" /> {{ $t('founder.linkedinCta') }}
          </a>
        </aside>
      </div>
    </section>

    <TechCapabilities />
    <CTASection />
  </div>
</template>

<style scoped>
.approach {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-10);
}

.approach article {
  padding-top: var(--space-6);
  border-top: 2px solid var(--color-text-primary);
}

.approach span {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
}

.approach h3 {
  margin-top: var(--space-3);
}

.approach p {
  margin-top: var(--space-3);
}

.career {
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.career__grid {
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
  align-items: start;
  gap: var(--space-16);
}

.timeline {
  position: relative;
  list-style: none;
}

.timeline::before {
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 0.3rem;
  width: 1px;
  background: var(--color-border-hover);
  content: '';
}

.timeline::after {
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 0.3rem;
  width: 1px;
  background: var(--color-accent);
  content: '';
  transform: scaleY(var(--progress, 1));
  transform-origin: top;
}

.timeline--animated::after {
  transform: scaleY(var(--progress, 0));
}

.timeline li {
  position: relative;
  z-index: 1;
  padding: 0 0 var(--space-10) var(--space-10);
}

.timeline li:last-child {
  padding-bottom: 0;
}

.timeline li::before {
  position: absolute;
  top: 0.35rem;
  left: 0;
  width: 0.65rem;
  height: 0.65rem;
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  background: var(--color-bg-surface);
  content: '';
}

.timeline li:first-child::before {
  background: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
}

.timeline__period {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.04em;
}

.timeline h3 {
  margin-top: var(--space-2);
}

.timeline__role {
  margin-top: var(--space-1);
  color: var(--color-accent);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.timeline__role + p {
  max-width: 44rem;
  margin-top: var(--space-3);
}

.career__aside {
  position: sticky;
  top: calc(var(--header-height) + var(--space-8));
  display: grid;
  gap: var(--space-5);
}

.facts {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
}

.facts h3 {
  margin-bottom: var(--space-3);
  font-size: var(--font-size-base);
}

.facts ul {
  display: grid;
  gap: var(--space-2);
  list-style: none;
  font-size: var(--font-size-sm);
}

@media (max-width: 960px) {
  .career__grid {
    grid-template-columns: 1fr;
  }

  .career__aside {
    position: static;
  }
}

@media (max-width: 760px) {
  .approach {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
</style>
