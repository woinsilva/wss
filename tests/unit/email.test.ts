import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildQuoteEmails, ResendEmailService } from '../../server/services/email'
import { quotePayload } from './fixtures'

afterEach(() => vi.unstubAllGlobals())

describe('quote email service', () => {
  it('builds localized content and escapes user HTML', () => {
    const { internal, confirmation } = buildQuoteEmails(quotePayload({ name: '<Admin>', description: '<b>Do not render</b> with enough text.' }))
    expect(internal.subject).toContain('NOVO ORÇAMENTO')
    expect(internal.html).toContain('&lt;Admin&gt;')
    expect(internal.html).not.toContain('<b>Do not render</b>')
    expect(confirmation.subject).toBe('Recebemos sua solicitação — WSS IT')
  })

  it('builds the English confirmation', () => {
    expect(buildQuoteEmails(quotePayload({ locale: 'en' })).confirmation.text).toContain('We received your request')
  })

  it('sends the internal and confirmation messages as one strict batch', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    await new ResendEmailService('secret', 'WSS <noreply@example.com>', 'team@example.com').sendQuote(quotePayload())
    const [, options] = fetchMock.mock.calls[0]!
    const body = JSON.parse(options.body)
    expect(body).toHaveLength(2)
    expect(body[0].reply_to).toBe('maria@example.com')
    expect(options.headers.authorization).toBe('Bearer secret')
  })

  it('throws when the provider rejects the batch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }))
    await expect(new ResendEmailService('secret', 'from@example.com', 'team@example.com').sendQuote(quotePayload())).rejects.toThrow('status 429')
  })
})
