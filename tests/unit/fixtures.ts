import type { QuotePayload } from '../../shared/utils/quoteSchema'

export function quotePayload(overrides: Partial<QuotePayload> = {}): QuotePayload {
  return {
    name: 'Maria Silva',
    company: 'Acme',
    email: 'maria@example.com',
    phone: '+55 41 99999-9999',
    projectType: 'custom-software',
    description: 'Precisamos modernizar nosso sistema de atendimento.',
    timeline: '3 months',
    budget: '50k-100k',
    howFound: 'Google',
    privacyConsent: true,
    turnstileToken: 'valid-token',
    website: '',
    locale: 'pt-BR',
    landingPage: '/orcamento',
    referrer: '',
    utmFirstTouch: null,
    utmLastTouch: null,
    submittedAt: '2026-09-10T12:00:00.000Z',
    ...overrides,
  }
}
