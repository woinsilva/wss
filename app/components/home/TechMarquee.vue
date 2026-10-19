<script setup lang="ts">
import { marqueeTechnologies, techIcon } from '~/data/techIcons'

const items = marqueeTechnologies.map(label => ({ label, icon: techIcon(label)! }))
</script>

<template>
  <section class="marquee" aria-labelledby="marquee-title">
    <div class="container">
      <h2 id="marquee-title" class="marquee__title">{{ $t('tech.marqueeTitle') }}</h2>
    </div>
    <MarqueeTrack class="marquee__track" :items="items" :item-key="item => item.label" :duration="52" gap="var(--space-16)">
      <template #default="{ item }">
        <span class="marquee__item" :style="{ '--brand': `#${item.icon.hex}` }">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path :d="item.icon.path" /></svg>
          {{ item.label }}
        </span>
      </template>
    </MarqueeTrack>
  </section>
</template>

<style scoped>
.marquee {
  padding: var(--space-16) 0;
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
}

.marquee__title {
  color: var(--color-text-muted);
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-align: center;
  text-transform: uppercase;
}

.marquee__track {
  margin-top: var(--space-8);
}

.marquee__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 2.5rem;
  color: #475569;
  font-family: var(--font-heading);
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color var(--transition-base);
}

.marquee__item svg {
  width: 1.6rem;
  height: 1.6rem;
  fill: currentcolor;
  opacity: 0.75;
  transition: fill var(--transition-base), opacity var(--transition-base);
}

.marquee__item:hover {
  color: var(--color-text-primary);
}

.marquee__item:hover svg {
  fill: var(--brand);
  opacity: 1;
}
</style>
