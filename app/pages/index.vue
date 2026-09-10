<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.ogTitle'),
  ogDescription: () => t('meta.ogDescription'),
})
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
