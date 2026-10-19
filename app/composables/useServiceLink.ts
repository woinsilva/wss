import { serviceByKey } from '~/data/services'

/** Returns a function that builds the localized URL of a service page from its key. */
export function useServiceLink() {
  const { locale } = useI18n()
  const routes = useSiteRoutes()

  return (key: string) => {
    const service = serviceByKey(key)
    if (!service) return routes.value.services
    return `${routes.value.services}/${service.slugs[locale.value === 'en' ? 'en' : 'pt-BR']}`
  }
}
