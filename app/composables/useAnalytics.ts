import type { AnalyticsEventParams } from '~/types'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function useAnalytics() {
  const config = useRuntimeConfig()

  function isGaAvailable(): boolean {
    return !!(config.public.gaId && typeof window !== 'undefined' && window.gtag)
  }

  function trackEvent(eventName: string, params?: AnalyticsEventParams): void {
    if (!isGaAvailable()) return

    try {
      window.gtag?.('event', eventName, {
        ...params,
        send_to: config.public.gaId,
      })
    }
    catch {
      // Silently fail — analytics should never break the app
    }
  }

  function trackQuoteFormStarted(language: string): void {
    trackEvent('quote_form_started', { language })
  }

  function trackQuoteFormSubmitted(projectType: string, language: string): void {
    trackEvent('quote_form_submitted', { project_type: projectType, language })
  }

  function trackQuoteFormSuccess(projectType: string, language: string): void {
    trackEvent('quote_form_success', { project_type: projectType, language })
  }

  function trackQuoteFormError(errorType: string, language: string): void {
    trackEvent('quote_form_error', { error_type: errorType, language })
  }

  function trackCtaClicked(location: string, service: string, language: string): void {
    trackEvent('contact_cta_clicked', { cta_location: location, service, language })
  }

  function trackLinkedInClicked(location: string, language: string): void {
    trackEvent('linkedin_clicked', { location, language })
  }

  function trackServiceViewed(serviceSlug: string, language: string): void {
    trackEvent('service_viewed', { service_slug: serviceSlug, language })
  }

  function trackLanguageChanged(from: string, to: string): void {
    trackEvent('language_changed', { from, to })
  }

  return {
    trackEvent,
    trackQuoteFormStarted,
    trackQuoteFormSubmitted,
    trackQuoteFormSuccess,
    trackQuoteFormError,
    trackCtaClicked,
    trackLinkedInClicked,
    trackServiceViewed,
    trackLanguageChanged,
  }
}
