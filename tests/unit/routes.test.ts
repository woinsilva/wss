import { describe, expect, it } from 'vitest'
import { findServiceBySlug, services } from '../../app/data/services'

describe('localized route definitions', () => {
  it('keeps every service slug unique and resolvable', () => {
    const slugs = services.flatMap(service => Object.values(service.slugs))
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const service of services) {
      expect(findServiceBySlug(service.slugs['pt-BR'])?.key).toBe(service.key)
      expect(findServiceBySlug(service.slugs.en)?.key).toBe(service.key)
    }
  })

  it('rejects unknown service routes', () => {
    expect(findServiceBySlug('missing')).toBeUndefined()
  })
})
