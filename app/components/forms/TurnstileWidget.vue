<script setup lang="ts">
const emit = defineEmits<{ verify: [token: string], expired: [] }>()
const config = useRuntimeConfig()
const container = ref<HTMLElement | null>(null)

declare global {
  interface Window {
    turnstile?: { render: (element: HTMLElement, options: Record<string, unknown>) => string }
  }
}

onMounted(() => {
  if (!config.public.turnstileSiteKey || !container.value) return
  const render = () => window.turnstile?.render(container.value!, {
    sitekey: config.public.turnstileSiteKey,
    theme: 'dark',
    callback: (token: string) => emit('verify', token),
    'expired-callback': () => emit('expired'),
    'error-callback': () => emit('expired'),
  })
  if (window.turnstile) render()
  else {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.addEventListener('load', render, { once: true })
    document.head.appendChild(script)
  }
})
</script>

<template>
  <div><div ref="container" /><p v-if="!config.public.turnstileSiteKey" class="turnstile-note">Turnstile requires configuration before submissions are enabled.</p></div>
</template>

<style scoped>.turnstile-note { font-size: var(--font-size-xs); color: var(--color-text-muted); }</style>
