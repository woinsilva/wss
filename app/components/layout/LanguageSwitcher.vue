<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const { trackLanguageChanged } = useAnalytics()

function trackChange(to: string) {
  if (to !== locale.value) trackLanguageChanged(locale.value, to)
}
</script>

<template>
  <nav class="language-switcher" aria-label="Language / Idioma">
    <NuxtLink
      :to="switchLocalePath('pt-BR')"
      :aria-current="locale === 'pt-BR' ? 'page' : undefined"
      hreflang="pt-BR"
      @click="trackChange('pt-BR')"
    >
      PT
    </NuxtLink>
    <span aria-hidden="true">/</span>
    <NuxtLink
      :to="switchLocalePath('en')"
      :aria-current="locale === 'en' ? 'page' : undefined"
      hreflang="en-US"
      @click="trackChange('en')"
    >
      EN
    </NuxtLink>
  </nav>
</template>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  color: var(--color-border-hover);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
}

.language-switcher a {
  padding: 0.4rem;
  color: var(--color-text-muted);
}

.language-switcher a:hover {
  color: var(--color-text-primary);
}

.language-switcher a[aria-current='page'] {
  color: var(--color-text-primary);
}
</style>
