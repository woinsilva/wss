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
  padding: var(--space-16) 0;
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
  margin-top: var(--space-6);
}

/* Sober by default (grayscale, muted), original brand colors on hover. */
.client {
  display: flex;
  height: 2rem;
  align-items: center;
  gap: var(--space-2);
  color: #475569;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color var(--transition-base);
}

.client img {
  width: auto;
  height: 1.4rem;
  /* brightness evens out light logos (e.g. Renault yellow) against dark ones in grayscale */
  filter: grayscale(1) brightness(0.7);
  opacity: 0.65;
  transition: filter var(--transition-base), opacity var(--transition-base);
}

.client--wordmark img {
  height: 1.1rem;
}

.client:hover {
  color: var(--color-text-primary);
}

.client:hover img {
  filter: none;
  opacity: 1;
}

.clients__note {
  max-width: 40rem;
  margin: var(--space-8) auto 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  text-align: center;
}
</style>
