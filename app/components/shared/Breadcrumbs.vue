<script setup lang="ts">
defineProps<{ items: Array<{ label: string, to?: string }> }>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="breadcrumbs">
    <ol>
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`">
        <NuxtLink v-if="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page">{{ item.label }}</span>
        <span v-if="index < items.length - 1" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs ol { display: flex; flex-wrap: wrap; gap: var(--space-2); list-style: none; }
.breadcrumbs li { display: flex; gap: var(--space-2); color: var(--color-text-muted); font-size: var(--font-size-sm); }
.breadcrumbs a { color: var(--color-text-secondary); }
</style>
