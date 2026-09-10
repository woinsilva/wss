export interface QuoteFormData {
  name: string
  company: string
  email: string
  phone: string
  projectType: string
  description: string
  timeline: string
  budget: string
  howFound: string
  privacyConsent: boolean
  turnstileToken: string
  /** Honeypot field — must be empty */
  website: string
}

export interface QuoteSubmission extends QuoteFormData {
  locale: string
  landingPage: string
  referrer: string
  utmFirstTouch: UtmData | null
  utmLastTouch: UtmData | null
  submittedAt: string
}

export interface UtmData {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
  referrer: string
  landingPage: string
  timestamp: string
}

export interface QuoteApiResponse {
  success: boolean
  message: string
}

export interface ServicePageData {
  slug: string
  icon: string
  titleKey: string
  descriptionKey: string
  context: string
  capabilities: string[]
  faq: FaqItem[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface CaseStudy {
  titleKey: string
  problemKey: string
  solutionKey: string
  technologies: string[]
}

export interface NavItem {
  labelKey: string
  to: string
  children?: NavItem[]
}

export type ProjectType =
  | 'custom-software'
  | 'website-landing-page'
  | 'ai-automation'
  | 'system-integration'
  | 'backend-api'
  | 'system-modernization'
  | 'technical-consulting'
  | 'code-review'
  | 'backend-rescue'
  | 'other'

export type BudgetRange =
  | 'unknown'
  | 'up-to-5k'
  | '5k-15k'
  | '15k-30k'
  | '30k-50k'
  | 'above-50k'

export interface AnalyticsEventParams {
  service_slug?: string
  language?: string
  cta_location?: string
  service?: string
  from?: string
  to?: string
  project_type?: string
  error_type?: string
  location?: string
}
