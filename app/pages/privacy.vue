<script setup lang="ts">
import { legalContent } from '~/data/legal'
defineI18nRoute({ paths: { 'pt-BR': '/politica-de-privacidade', en: '/privacy-policy' } })
const { locale } = useI18n()
const content = computed(() => legalContent[locale.value as 'pt-BR' | 'en'].privacy)
useSeoMeta({ title: () => `${content.value.title} — WSS IT` })
</script>
<template><LegalPage :title="content.title" :updated="content.updated" :sections="content.sections" /></template>
