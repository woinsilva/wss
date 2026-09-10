<script setup lang="ts">
import { findServiceBySlug } from '~/data/services'

defineI18nRoute({ paths: { 'pt-BR': '/servicos/[slug]', en: '/services/[slug]' } })

const route = useRoute()
const service = computed(() => findServiceBySlug(String(route.params.slug)))
if (!service.value) throw createError({ statusCode: 404, statusMessage: 'Service not found' })

const setI18nParams = useSetI18nParams()
setI18nParams({
  'pt-BR': { slug: service.value.slugs['pt-BR'] },
  en: { slug: service.value.slugs.en },
})
</script>

<template>
  <ServicePageTemplate v-if="service" :service="service" />
</template>
