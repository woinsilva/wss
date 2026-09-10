<script setup lang="ts">
defineProps<{ error: { statusCode?: number } }>()
const route = useRoute()
const { locale, setLocale, t } = useI18n()
const english = computed(() => route.path === '/en' || route.path.startsWith('/en/'))
if (english.value && locale.value !== 'en') await setLocale('en')
const home = computed(() => english.value ? '/en' : '/')
</script>

<template>
  <main class="error-page"><div class="error-page__glow" /><div class="error-page__content"><AppLogo /><p class="error-page__code">{{ error.statusCode || 500 }}</p><h1>{{ error.statusCode === 404 ? t('notFound.title') : t('error.title') }}</h1><p>{{ error.statusCode === 404 ? t('notFound.message') : t('error.message') }}</p><AppButton :to="home" size="large" @click="clearError({ redirect: home })">{{ error.statusCode === 404 ? t('notFound.cta') : t('error.cta') }}</AppButton></div></main>
</template>

<style scoped>
.error-page { display: grid; min-height: 100vh; place-items: center; padding: var(--space-6); background: var(--color-bg-primary); text-align: center; }.error-page__content { position: relative; z-index: 1; max-width: 38rem; }.error-page__content > :first-child { justify-content: center; }.error-page__code { margin-top: var(--space-12); color: var(--color-accent-cyan); font-size: var(--font-size-sm); font-weight: 800; letter-spacing: .2em; }.error-page h1 { margin: var(--space-4) 0; font-size: clamp(2.5rem, 7vw, 5rem); }.error-page__content > p:not(.error-page__code) { margin-bottom: var(--space-8); font-size: var(--font-size-lg); }.error-page__glow { position: fixed; width: 38rem; height: 38rem; border-radius: 50%; background: rgba(37,99,235,.18); filter: blur(120px); }
</style>
