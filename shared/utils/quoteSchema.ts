import { z } from 'zod'

const optionalPhone = z.string().trim().max(30).refine(
  value => !value || (/^[+()\d\s.-]{7,30}$/.test(value) && value.replace(/\D/g, '').length >= 7),
  'Invalid international phone number',
)

export const quoteFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120),
  email: z.email().max(254),
  phone: optionalPhone,
  projectType: z.enum(['custom-software', 'website-landing-page', 'ai-automation', 'system-integration', 'backend-api', 'system-modernization', 'technical-consulting', 'code-review', 'backend-rescue', 'other']),
  description: z.string().trim().min(20).max(4000),
  timeline: z.string().trim().max(100),
  budget: z.string().trim().max(50),
  howFound: z.string().trim().max(200),
  privacyConsent: z.boolean().refine(Boolean),
  turnstileToken: z.string().min(1).max(2048),
  website: z.string().max(0),
}).strict()

export const quoteSubmissionSchema = quoteFormSchema.extend({
  locale: z.enum(['pt-BR', 'en']),
  landingPage: z.string().max(500),
  referrer: z.string().max(1000),
  utmFirstTouch: z.object({ source: z.string(), medium: z.string(), campaign: z.string(), content: z.string(), term: z.string(), referrer: z.string(), landingPage: z.string(), timestamp: z.string() }).nullable(),
  utmLastTouch: z.object({ source: z.string(), medium: z.string(), campaign: z.string(), content: z.string(), term: z.string(), referrer: z.string(), landingPage: z.string(), timestamp: z.string() }).nullable(),
  submittedAt: z.iso.datetime(),
}).strict()

export type QuotePayload = z.infer<typeof quoteSubmissionSchema>
