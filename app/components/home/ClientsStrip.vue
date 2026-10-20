<script setup lang="ts">
import { clients } from '~/data/clients'
</script>

<template>
  <section class="clients" aria-labelledby="clients-title">
    <div class="container">
      <h2 id="clients-title" class="clients__title">{{ $t('clients.title') }}</h2>
    </div>
    <MarqueeTrack class="clients__track" :items="clients" :item-key="client => client.name" :duration="40" gap="var(--space-12)">
      <template #default="{ item }">
        <span class="client" :class="{ 'client--wordmark': item.wordmark }">
          <img v-if="item.logo" :src="item.logo" :alt="item.wordmark ? item.name : ''" decoding="async">
          <span v-if="!item.wordmark">{{ item.name }}</span>
        </span>
      </template>
    </MarqueeTrack>
    <div class="container">
      <p class="clients__note">{{ $t('clients.note') }}</p>
    </div>
  </section>
</template>

<style scoped>
.clients {
  padding: var(--space-10) 0 var(--space-8);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
}

.clients__title {
  color: var(--color-text-muted);
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-align: center;
  text-transform: uppercase;
}

.clients__track {
  margin-top: var(--space-5);
}

/* Monochrome white logos on the dark base; full white with a soft glow on hover. */
.client {
  display: flex;
  height: 2rem;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color var(--transition-base);
}

.client img {
  width: auto;
  height: 1.4rem;
  /* brightness(0) + invert(1) turns every logo into a white silhouette */
  filter: brightness(0) invert(1);
  opacity: 0.6;
  transition: filter var(--transition-base), opacity var(--transition-base);
}

.client--wordmark img {
  height: 1.1rem;
}

.client:hover {
  color: var(--color-text-primary);
}

.client:hover img {
  filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(91, 140, 255, 0.6));
  opacity: 1;
}

.clients__note {
  max-width: 40rem;
  margin: var(--space-5) auto 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  text-align: center;
}
</style>
