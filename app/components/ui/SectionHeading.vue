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
  <header v-reveal class="section-heading" :class="`section-heading--${align}`">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="description" class="section-heading__description">{{ description }}</p>
    <slot />
  </header>
</template>

<style scoped>
.section-heading {
  max-width: 44rem;
  margin-bottom: var(--space-12);
}

.section-heading .eyebrow {
  margin-bottom: var(--space-4);
}

.section-heading--center {
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.section-heading--center .eyebrow::after {
  width: 1.5rem;
  height: 2px;
  background: currentcolor;
  content: '';
}

.section-heading__description {
  margin-top: var(--space-5);
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

@media (max-width: 768px) {
  .section-heading {
    margin-bottom: var(--space-10);
  }
}
</style>
