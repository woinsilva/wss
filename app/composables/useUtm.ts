import type { UtmData } from '~/types'

const FIRST_TOUCH_KEY = 'wss_utm_first'
const LAST_TOUCH_KEY = 'wss_utm_last'

function getUtmFromUrl(): UtmData | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const source = params.get('utm_source') || ''
  const medium = params.get('utm_medium') || ''
  const campaign = params.get('utm_campaign') || ''
  const content = params.get('utm_content') || ''
  const term = params.get('utm_term') || ''

  // Only create UTM data if at least one parameter exists
  if (!source && !medium && !campaign && !content && !term) {
    return null
  }

  return {
    source,
    medium,
    campaign,
    content,
    term,
    referrer: document.referrer || '',
    landingPage: window.location.pathname,
    timestamp: new Date().toISOString(),
  }
}

function getStoredUtm(key: string): UtmData | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  }
  catch {
    return null
  }
}

function storeUtm(key: string, data: UtmData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  }
  catch {
    // localStorage not available
  }
}

export function useUtm() {
  function initUtm(): void {
    const currentUtm = getUtmFromUrl()
    if (!currentUtm) return

    // First touch: never overwrite
    const existingFirst = getStoredUtm(FIRST_TOUCH_KEY)
    if (!existingFirst) {
      storeUtm(FIRST_TOUCH_KEY, currentUtm)
    }

    // Last touch: always update when new UTM params detected
    storeUtm(LAST_TOUCH_KEY, currentUtm)
  }

  function captureReferrer(): void {
    if (typeof window === 'undefined') return

    const existingFirst = getStoredUtm(FIRST_TOUCH_KEY)
    if (!existingFirst && document.referrer) {
      const referrerData: UtmData = {
        source: '',
        medium: '',
        campaign: '',
        content: '',
        term: '',
        referrer: document.referrer,
        landingPage: window.location.pathname,
        timestamp: new Date().toISOString(),
      }
      storeUtm(FIRST_TOUCH_KEY, referrerData)
    }
  }

  function getFirstTouch(): UtmData | null {
    return getStoredUtm(FIRST_TOUCH_KEY)
  }

  function getLastTouch(): UtmData | null {
    return getStoredUtm(LAST_TOUCH_KEY)
  }

  return {
    initUtm,
    captureReferrer,
    getFirstTouch,
    getLastTouch,
  }
}
