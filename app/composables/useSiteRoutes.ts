export function useSiteRoutes() {
  const { locale } = useI18n()

  return computed(() => locale.value === 'en'
    ? {
        home: '/en',
        services: '/en/services',
        about: '/en/about',
        quote: '/en/quote',
        privacy: '/en/privacy-policy',
        terms: '/en/terms',
      }
    : {
        home: '/',
        services: '/servicos',
        about: '/sobre',
        quote: '/orcamento',
        privacy: '/politica-de-privacidade',
        terms: '/termos',
      })
}
