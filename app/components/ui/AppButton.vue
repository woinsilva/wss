<script setup lang="ts">
withDefaults(defineProps<{
  to?: string
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'large'
  type?: 'button' | 'submit'
}>(), {
  to: undefined,
  variant: 'primary',
  size: 'default',
  type: 'button',
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="btn"
    :class="[`btn-${variant}`, { 'btn-lg': size === 'large' }]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    class="btn"
    :class="[`btn-${variant}`, { 'btn-lg': size === 'large' }]"
  >
    <slot />
  </button>
</template>
