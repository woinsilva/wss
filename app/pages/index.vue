<script setup lang="ts">
const { t } = useI18n()
const { tm } = useI18n()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.ogTitle'),
  ogDescription: () => t('meta.ogDescription'),
})

useHead(() => ({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (tm('faq.items') as unknown as Array<{ question: string, answer: string }>).map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}) }] }))
</script>

<template>
  <div>
    <HeroSection />
    <ServicesOverview />
    <CustomSoftwareSection />
    <AISection />
    <TechCapabilities />
    <FounderSection />
    <ProcessSection />
    <CaseStudiesSection />
    <FAQSection />
    <CTASection />
  </div>
</template>
