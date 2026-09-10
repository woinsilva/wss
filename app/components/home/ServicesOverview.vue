<script setup lang="ts">
interface ServiceCard { title: string, context: string, description: string }
const { locale } = useI18n()
const routes = useSiteRoutes()
const keys = ['websites', 'customSoftware', 'aiAutomation', 'integration', 'backend', 'backendRescue']
const content = useTranslatedContent<Record<string, ServiceCard>>('services.items')
const services = computed(() => keys.map(key => ({ key, ...content.value[key]! })))
const slugs: Record<string, [string, string]> = {
  websites: ['landing-pages-sites', 'websites-landing-pages'], customSoftware: ['desenvolvimento-de-software', 'custom-software-development'],
  aiAutomation: ['automacao-inteligencia-artificial', 'ai-automation'], integration: ['integracao-de-sistemas-api', 'api-integration'],
  backend: ['backend-apis', 'backend-engineering'], backendRescue: ['modernizacao-sistemas', 'system-modernization'],
}
function serviceUrl(key: string) { return `${routes.value.services}/${slugs[key]?.[locale.value === 'en' ? 1 : 0]}` }
</script>

<template>
  <section class="section services-section">
    <div class="container">
      <SectionHeading :title="$t('services.sectionTitle')" :description="$t('services.sectionSubtitle')" />
      <div class="services-grid">
        <NuxtLink v-for="service in services" :key="service.key" :to="serviceUrl(service.key)" class="service-card glass-card">
          <p class="service-card__context">{{ service.context }}</p><h3>{{ service.title }}</h3><p>{{ service.description }}</p>
          <span>{{ $t('services.cta') }} <span aria-hidden="true">→</span></span>
        </NuxtLink>
      </div>
      <div class="services-section__footer"><AppButton :to="routes.services" variant="secondary">{{ $t('services.viewAll') }}</AppButton></div>
    </div>
  </section>
</template>

<style scoped>
.services-section { background: var(--color-bg-surface); }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.service-card { display: flex; min-height: 19rem; flex-direction: column; padding: var(--space-6); color: inherit; }
.service-card__context { min-height: 4.5rem; color: var(--color-accent-cyan); font-size: var(--font-size-sm); }
.service-card h3 { margin: var(--space-5) 0 var(--space-3); font-size: var(--font-size-xl); }
.service-card > span { margin-top: auto; padding-top: var(--space-5); color: var(--color-text-primary); font-weight: 650; }
.services-section__footer { margin-top: var(--space-8); text-align: center; }
@media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .services-grid { grid-template-columns: 1fr; } }
</style>
