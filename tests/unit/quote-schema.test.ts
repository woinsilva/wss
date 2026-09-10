import { describe, expect, it } from 'vitest'
import { quoteFormSchema, quoteSubmissionSchema } from '../../shared/utils/quoteSchema'
import { quotePayload } from './fixtures'

describe('quote schemas', () => {
  it('accepts a complete international submission', () => {
    expect(quoteSubmissionSchema.safeParse(quotePayload()).success).toBe(true)
  })

  it('accepts an empty optional phone and rejects malformed numbers', () => {
    expect(quoteSubmissionSchema.safeParse(quotePayload({ phone: '' })).success).toBe(true)
    expect(quoteSubmissionSchema.safeParse(quotePayload({ phone: 'call-me' })).success).toBe(false)
  })

  it('rejects short descriptions and missing consent', () => {
    expect(quoteSubmissionSchema.safeParse(quotePayload({ description: 'Too short' })).success).toBe(false)
    expect(quoteSubmissionSchema.safeParse(quotePayload({ privacyConsent: false })).success).toBe(false)
  })

  it('rejects unknown fields and server-only fields in the browser schema', () => {
    expect(quoteSubmissionSchema.safeParse({ ...quotePayload(), injected: true }).success).toBe(false)
    expect(quoteFormSchema.safeParse(quotePayload()).success).toBe(false)
  })
})
