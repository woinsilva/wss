<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}>(), {
  eyebrow: undefined,
  description: undefined,
  align: 'left',
})
</script>

<template>
  <header class="section-heading" :class="`section-heading--${align}`">
    <p v-if="eyebrow" class="section-heading__eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="description" class="section-heading__description">{{ description }}</p>
  </header>
</template>

<style scoped>
.section-heading {
  max-width: 46rem;
  margin-bottom: var(--space-12);
}

.section-heading--center {
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.section-heading__eyebrow {
  margin-bottom: var(--space-3);
  color: var(--color-accent-cyan);
  font-size: var(--font-size-sm);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-heading__description {
  margin-top: var(--space-5);
  font-size: var(--font-size-lg);
}
</style>
