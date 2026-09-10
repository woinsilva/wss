<script setup lang="ts">
const { locale } = useI18n()
const { initUtm, captureReferrer } = useUtm()

useHead(() => ({
  htmlAttrs: { lang: locale.value === 'en' ? 'en-US' : 'pt-BR' },
}))

onMounted(() => {
  initUtm()
  captureReferrer()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
