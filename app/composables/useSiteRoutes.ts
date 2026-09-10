export function useSiteRoutes() {
  const { locale } = useI18n()

  return computed(() => locale.value === 'en'
    ? {
        home: '/en',
        services: '/en/services',
        solutions: '/en/solutions',
        about: '/en/about',
        quote: '/en/quote',
        privacy: '/en/privacy-policy',
        terms: '/en/terms',
      }
    : {
        home: '/',
        services: '/servicos',
        solutions: '/solucoes',
        about: '/sobre',
        quote: '/orcamento',
        privacy: '/politica-de-privacidade',
        terms: '/termos',
      })
}
