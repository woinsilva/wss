// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { useUtm } from '../../app/composables/useUtm'

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('UTM attribution', () => {
  it('preserves first touch and refreshes last touch', () => {
    window.history.replaceState({}, '', '/?utm_source=google&utm_campaign=launch')
    const utm = useUtm()
    utm.initUtm()
    window.history.replaceState({}, '', '/en?utm_source=linkedin&utm_medium=paid')
    utm.initUtm()
    expect(utm.getFirstTouch()?.source).toBe('google')
    expect(utm.getFirstTouch()?.landingPage).toBe('/')
    expect(utm.getLastTouch()?.source).toBe('linkedin')
    expect(utm.getLastTouch()?.landingPage).toBe('/en')
  })

  it('does not create attribution without a UTM or referrer', () => {
    const utm = useUtm()
    utm.initUtm()
    utm.captureReferrer()
    expect(utm.getFirstTouch()).toBeNull()
    expect(utm.getLastTouch()).toBeNull()
  })

  it('tolerates malformed persisted values', () => {
    localStorage.setItem('wss_utm_first', '{bad json')
    expect(useUtm().getFirstTouch()).toBeNull()
  })
})
