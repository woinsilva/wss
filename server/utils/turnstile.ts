interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstile(token: string, secret: string, remoteIp?: string): Promise<boolean> {
  if (!secret || !token) return false
  const body = new FormData()
  body.set('secret', secret)
  body.set('response', token)
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    if (!response.ok) return false
    const result = await response.json() as TurnstileResponse
    return result.success === true
  }
  catch {
    return false
  }
}
