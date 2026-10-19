<script setup lang="ts">
defineProps<{ error: { statusCode?: number } }>()
const route = useRoute()
const { locale, setLocale, t } = useI18n()
const english = computed(() => route.path === '/en' || route.path.startsWith('/en/'))
if (english.value && locale.value !== 'en') await setLocale('en')
const home = computed(() => english.value ? '/en' : '/')
</script>

<template>
  <main class="error-page">
    <div class="error-page__grid" aria-hidden="true" />
    <div class="error-page__content">
      <NuxtLink :to="home" class="error-page__logo"><AppLogo /></NuxtLink>
      <p class="error-page__code">{{ error.statusCode || 500 }}</p>
      <h1>{{ error.statusCode === 404 ? t('notFound.title') : t('error.title') }}</h1>
      <p class="error-page__message">{{ error.statusCode === 404 ? t('notFound.message') : t('error.message') }}</p>
      <AppButton :to="home" size="large" @click="clearError({ redirect: home })">{{ error.statusCode === 404 ? t('notFound.cta') : t('error.cta') }}</AppButton>
    </div>
  </main>
</template>

<style scoped>
.error-page { position: relative; display: grid; min-height: 100vh; place-items: center; overflow: hidden; padding: var(--space-6); background: var(--color-bg-surface); text-align: center; }
.error-page__grid { position: absolute; inset: 0; background-image: linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px); background-size: 64px 64px; mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000, transparent 75%); -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000, transparent 75%); }
.error-page__content { position: relative; z-index: 1; display: flex; max-width: 36rem; flex-direction: column; align-items: center; }
.error-page__code { margin-top: var(--space-16); color: var(--color-accent); font-family: var(--font-mono); font-size: var(--font-size-sm); font-weight: 600; letter-spacing: .2em; }
.error-page h1 { margin-top: var(--space-4); }
.error-page__message { margin: var(--space-4) 0 var(--space-8); font-size: var(--font-size-lg); }
</style>
