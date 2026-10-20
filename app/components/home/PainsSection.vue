<script setup lang="ts">
interface Pain { lead: string, text: string }
const items = useTranslatedContent<Pain[]>('pains.items')

const section = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const active = ref(0)
let revert: (() => void) | undefined

/**
 * Desktop: the section pins and vertical scrolling moves the cards horizontally (scrubbed);
 * the page continues once the last card has passed. Small screens keep a plain vertical list.
 * Runs in both motion levels (the soft level only follows the scroll more tightly).
 */
onMounted(async () => {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  media.add('(min-width: 900px)', () => {
    const distance = () => Math.max(0, track.value!.scrollWidth - viewport.value!.clientWidth)
    gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section.value,
        pin: true,
        start: 'top top',
        // Roughly one wheel "page" per card, so each one gets its moment in focus.
        end: () => `+=${distance() * 1.1}`,
        scrub: prefersReducedMotion() ? 0.4 : 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onUpdate: (self) => { active.value = Math.round(self.progress * (items.value.length - 1)) },
      },
    })
    return () => { active.value = 0 }
  })
  revert = () => media.revert()
  // Triggers further down were measured before this pin existed.
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => revert?.())
</script>

<template>
  <section ref="section" class="pains">
    <div class="container pains__head">
      <SectionHeading :eyebrow="$t('pains.eyebrow')" :title="$t('pains.title')" :description="$t('pains.subtitle')" />
    </div>
    <div ref="viewport" class="pains__viewport">
      <ul ref="track" class="pains__track">
        <li v-for="(item, index) in items" :key="item.lead" class="pains__card" :class="{ 'pains__card--active': index === active }">
          <div class="pains__art">
            <PainIllustration :variant="index" />
          </div>
          <div class="pains__text">
            <span class="pains__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }}</span>
            <p><strong>{{ item.lead }}</strong> {{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.pains {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  padding: calc(var(--header-height) + var(--space-6)) 0 var(--space-8);
  overflow: hidden;
}

.pains__head :deep(.section-heading) {
  max-width: 48rem;
  margin-bottom: var(--space-8);
}

.pains__viewport {
  overflow: hidden;
}

.pains__track {
  display: flex;
  width: max-content;
  gap: var(--space-5);
  /* Start aligned with the container, end with the same breathing room. */
  padding: 0 max(var(--space-8), calc((100vw - var(--container-max)) / 2));
  list-style: none;
  will-change: transform;
}

.pains__card {
  display: grid;
  /* One card in focus at a time; the next one peeks in at the edge. */
  width: min(76vw, 70rem);
  /* Fits under the heading inside the pinned viewport. */
  height: clamp(20rem, calc(100vh - 26rem), 34rem);
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(ellipse 80% 60% at 0% 0%, rgba(37, 99, 235, 0.14), transparent 70%),
    #0F1526;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.pains__card--active,
.pains__card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--glow-accent);
}

.pains__art {
  display: grid;
  place-items: center;
  padding: var(--space-8);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    #0A1020;
  background-size: 32px 32px, 32px 32px, auto;
}

.pains__text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-8);
  padding: clamp(2rem, 4vw, 3.5rem);
}

.pains__index {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.pains__card p {
  color: var(--color-text-secondary);
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.55;
}

.pains__card strong {
  display: block;
  margin-bottom: var(--space-5);
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

/* Small screens: plain vertical list, no pinning. */
@media (max-width: 899px) {
  .pains {
    min-height: 0;
    padding: var(--space-16) 0;
  }

  .pains__track {
    width: auto;
    flex-direction: column;
    padding: 0 var(--space-5);
  }

  .pains__card {
    width: auto;
    height: auto;
    grid-template-columns: 1fr;
  }

  .pains__art {
    height: 12rem;
    padding: var(--space-5);
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .pains__text {
    gap: var(--space-4);
    padding: var(--space-6);
  }

  .pains__card--active {
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: none;
  }
}
</style>
