<script setup lang="ts">
const { initUtm, captureReferrer } = useUtm()
const config = useRuntimeConfig()
const localeHead = useLocaleHead({ seo: { canonicalQueries: [] } })

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
  script: config.public.gaId
    ? [
        { src: `https://www.googletagmanager.com/gtag/js?id=${config.public.gaId}`, async: true },
        { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${config.public.gaId}');` },
      ]
    : [],
}))

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'WSS IT',
  ogImage: () => `${config.public.siteUrl || 'https://wssit.com.br'}/og-image.png`,
  twitterCard: 'summary_large_image',
  twitterImage: () => `${config.public.siteUrl || 'https://wssit.com.br'}/og-image.png`,
})

useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  name: 'WSS IT',
  url: 'https://wssit.com.br',
  email: 'wssitconsultoria@gmail.com',
  areaServed: ['Brazil', 'Paraná', 'Curitiba', 'Campo Largo'],
  address: { '@type': 'PostalAddress', addressLocality: 'Campo Largo', addressRegion: 'PR', addressCountry: 'BR' },
  sameAs: ['https://www.linkedin.com/in/wagner-santos-silva-5a70a86a/'],
}) }] })

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
