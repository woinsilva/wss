<script setup lang="ts">
/** `light` = for light backgrounds (navy wordmark); `dark` = for dark backgrounds (white wordmark). */
const props = withDefaults(defineProps<{ variant?: 'light' | 'dark' }>(), { variant: 'dark' })
const src = computed(() => props.variant === 'dark' ? '/brand/wss-it-logo-web.png' : '/brand/wss-it-logo-on-light-web.png')
</script>

<template>
  <img
    class="brand"
    :src="src"
    alt="WSS IT"
    width="753"
    height="160"
    decoding="async"
  >
</template>

<style scoped>
.brand {
  display: block;
  width: auto;
  height: 2.5rem;
}

@media (max-width: 640px) {
  .brand {
    height: 2.125rem;
  }
}
</style>
