import { quoteSubmissionSchema } from '~~/shared/utils/quoteSchema'
import { ResendEmailService } from '../services/email'
import { sanitizeQuote } from '../utils/sanitize'
import { verifyTurnstile } from '../utils/turnstile'

const MAX_BODY_BYTES = 50 * 1024

export default defineEventHandler(async (event) => {
  const contentLength = Number(getHeader(event, 'content-length') || 0)
  if (contentLength > MAX_BODY_BYTES) throw createError({ statusCode: 413, statusMessage: 'Request body too large' })

  const rawBody = await readRawBody(event, 'utf8')
  if (!rawBody || new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) throw createError({ statusCode: 413, statusMessage: 'Request body too large' })

  let unknownPayload: unknown
  try { unknownPayload = JSON.parse(rawBody) }
  catch { throw createError({ statusCode: 400, statusMessage: 'Invalid JSON payload' }) }

  if (unknownPayload && typeof unknownPayload === 'object' && 'website' in unknownPayload && typeof unknownPayload.website === 'string' && unknownPayload.website) {
    return { success: true, message: 'Request received' }
  }

  const parsed = quoteSubmissionSchema.safeParse(unknownPayload)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid quote request' })

  const config = useRuntimeConfig()
  const remoteIp = getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
  const validTurnstile = await verifyTurnstile(parsed.data.turnstileToken, config.turnstileSecretKey, remoteIp)
  if (!validTurnstile) throw createError({ statusCode: 403, statusMessage: 'Security verification failed' })

  const payload = sanitizeQuote(parsed.data)
  const sanitized = quoteSubmissionSchema.safeParse(payload)
  if (!sanitized.success) throw createError({ statusCode: 400, statusMessage: 'Invalid quote request' })

  try {
    const email = new ResendEmailService(config.resendApiKey, config.quoteFromEmail, config.quoteDestinationEmail)
    await email.sendQuote(sanitized.data)
    return { success: true, message: 'Quote request sent' }
  }
  catch (error) {
    console.error('Quote submission delivery failed', error instanceof Error ? error.message : 'Unknown error')
    throw createError({ statusCode: 502, statusMessage: 'Unable to deliver quote request' })
  }
})
