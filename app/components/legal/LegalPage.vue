<script setup lang="ts">
defineProps<{ title: string, updated: string, sections: ReadonlyArray<readonly [string, string]> }>()
const routes = useSiteRoutes()
const { t } = useI18n()
</script>

<template>
  <article class="legal section"><div class="container legal__content"><Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: title }]" /><h1>{{ title }}</h1><p class="legal__updated">{{ updated }}</p><section v-for="section in sections" :key="section[0]"><h2>{{ section[0] }}</h2><p>{{ section[1] }}</p></section></div></article>
</template>

<style scoped>
.legal__content { max-width: 52rem; }.legal h1 { margin: var(--space-12) 0 var(--space-3); font-size: clamp(2.5rem, 6vw, 4.5rem); }.legal__updated { margin-bottom: var(--space-16); }.legal section { margin-top: var(--space-10); }.legal h2 { margin-bottom: var(--space-4); font-size: var(--font-size-2xl); }
</style>
