import { afterEach, describe, expect, it, vi } from 'vitest'
import { verifyTurnstile } from '../../server/utils/turnstile'

afterEach(() => vi.unstubAllGlobals())

describe('Turnstile verification', () => {
  it('rejects missing credentials without making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect(await verifyTurnstile('', 'secret')).toBe(false)
    expect(await verifyTurnstile('token', '')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns the provider result and includes the remote IP', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)
    expect(await verifyTurnstile('token', 'secret', '203.0.113.1')).toBe(true)
    const body = fetchMock.mock.calls[0]![1].body as FormData
    expect(body.get('remoteip')).toBe('203.0.113.1')
  })

  it('fails closed for HTTP and network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    expect(await verifyTurnstile('token', 'secret')).toBe(false)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await verifyTurnstile('token', 'secret')).toBe(false)
  })
})
