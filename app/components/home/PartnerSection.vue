<script setup lang="ts">
interface Differential { title: string, text: string }
const items = useTranslatedContent<Differential[]>('partner.items')
</script>

<template>
  <section v-section-in class="partner surface-dark" aria-labelledby="partner-title">
    <div v-parallax="20" class="partner__glow" aria-hidden="true" />
    <div class="container">
      <div class="partner__intro">
        <p v-reveal class="eyebrow">{{ $t('partner.eyebrow') }}</p>
        <h2 id="partner-title" v-scrub-words><AccentText :text="$t('partner.statement')" /></h2>
        <p v-reveal="120" class="partner__lead">{{ $t('partner.lead') }}</p>
      </div>
      <ol class="partner__list">
        <li v-for="(item, index) in items" :key="item.title" v-reveal="index * 100" v-spotlight class="partner__item">
          <span class="partner__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.partner {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: clamp(5rem, 11vw, 9rem) 0;
}

.partner__glow {
  position: absolute;
  z-index: -1;
  /* Taller than the section so the parallax never shows an edge. */
  inset: -15% 0;
  background:
    radial-gradient(ellipse 55% 60% at 50% 0%, rgba(37, 99, 235, 0.35), transparent 70%),
    linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: auto, 64px 64px, 64px 64px;
  mask-image: linear-gradient(#000 60%, transparent);
  -webkit-mask-image: linear-gradient(#000 60%, transparent);
}

.partner__intro {
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
}

.partner__intro .eyebrow::after {
  width: 1.5rem;
  height: 2px;
  background: currentcolor;
  content: '';
}

.partner h2 {
  margin-top: var(--space-5);
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1.02;
}

.partner__lead {
  max-width: 42rem;
  margin: var(--space-6) auto 0;
  font-size: var(--font-size-lg);
}

.partner__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin-top: clamp(3rem, 6vw, 5rem);
  list-style: none;
}

.partner__item {
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color var(--transition-base), transform var(--transition-base), background-color var(--transition-base);
}

.partner__item:hover {
  border-color: var(--color-accent-line);
  background: rgba(91, 140, 255, 0.07);
  transform: translateY(-4px);
}

.partner__number {
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: 2.5rem;
  line-height: 1;
}

.partner__item h3 {
  margin-top: var(--space-5);
  font-size: var(--font-size-lg);
}

.partner__item p {
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
}

@media (max-width: 900px) {
  .partner__list {
    grid-template-columns: 1fr;
  }

  .partner__item {
    padding: var(--space-6);
  }
}
</style>
