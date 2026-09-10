<script setup lang="ts">
const { t } = useI18n()
const faqItems = useTranslatedContent<Array<{ question: string, answer: string }>>('faq.items')

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.ogTitle'),
  ogDescription: () => t('meta.ogDescription'),
})

useHead(() => ({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.value.map(item => ({
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
