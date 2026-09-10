import { describe, expect, it } from 'vitest'
import { sanitizeQuote, sanitizeText } from '../../server/utils/sanitize'
import { quotePayload } from './fixtures'

describe('quote sanitization', () => {
  it('removes tags and control characters while preserving line breaks', () => {
    expect(sanitizeText('  <b>Hello</b>\u0000\nworld  ')).toBe('Hello\nworld')
  })

  it('sanitizes all free-text fields without mutating structured data', () => {
    const result = sanitizeQuote(quotePayload({ name: '<i>Maria</i>', description: '<script>alert(1)</script>Safe description with enough text.' }))
    expect(result.name).toBe('Maria')
    expect(result.description).toBe('alert(1)Safe description with enough text.')
    expect(result.email).toBe('maria@example.com')
  })
})
