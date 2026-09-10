export interface ServiceDefinition {
  key: string
  translationKey: string
  capabilityKey: string
  slugs: { 'pt-BR': string, en: string }
}

export const services: ServiceDefinition[] = [
  { key: 'custom-software', translationKey: 'customSoftware', capabilityKey: 'customSoftware', slugs: { 'pt-BR': 'desenvolvimento-de-software', en: 'custom-software-development' } },
  { key: 'bespoke-systems', translationKey: 'bespokeSystem', capabilityKey: 'customSoftware', slugs: { 'pt-BR': 'sistemas-sob-medida', en: 'bespoke-systems' } },
  { key: 'websites', translationKey: 'websites', capabilityKey: 'websites', slugs: { 'pt-BR': 'landing-pages-sites', en: 'websites-landing-pages' } },
  { key: 'integration', translationKey: 'integration', capabilityKey: 'integration', slugs: { 'pt-BR': 'integracao-de-sistemas-api', en: 'api-integration' } },
  { key: 'ai-automation', translationKey: 'aiAutomation', capabilityKey: 'aiAutomation', slugs: { 'pt-BR': 'automacao-inteligencia-artificial', en: 'ai-automation' } },
  { key: 'backend', translationKey: 'backendApis', capabilityKey: 'backend', slugs: { 'pt-BR': 'backend-apis', en: 'backend-engineering' } },
  { key: 'consulting', translationKey: 'consulting', capabilityKey: 'consulting', slugs: { 'pt-BR': 'consultoria-tecnologia', en: 'technology-consulting' } },
  { key: 'modernization', translationKey: 'modernization', capabilityKey: 'backendRescue', slugs: { 'pt-BR': 'modernizacao-sistemas', en: 'system-modernization' } },
  { key: 'code-review', translationKey: 'codeReview', capabilityKey: 'consulting', slugs: { 'pt-BR': 'code-review-arquitetura', en: 'code-review-architecture' } },
]

export function findServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find(service => Object.values(service.slugs).includes(slug))
}
