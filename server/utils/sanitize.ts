import type { QuotePayload } from '~~/shared/utils/quoteSchema'

export function sanitizeText(value: string): string {
  return [...value.replace(/<[^>]*>/g, '')]
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code !== 127 && (code >= 32 || character === '\n' || character === '\r' || character === '\t')
    })
    .join('')
    .trim()
}

export function sanitizeQuote(payload: QuotePayload): QuotePayload {
  return {
    ...payload,
    name: sanitizeText(payload.name),
    company: sanitizeText(payload.company),
    phone: sanitizeText(payload.phone),
    description: sanitizeText(payload.description),
    timeline: sanitizeText(payload.timeline),
    howFound: sanitizeText(payload.howFound),
  }
}
