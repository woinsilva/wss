import type { Directive } from 'vue'

/**
 * Motion directives. Both are no-ops on the server and when the user prefers reduced motion,
 * so prerendered content is always visible without JavaScript.
 *
 * v-reveal="delayMs"  fades/slides the element in when it scrolls into view.
 * v-spotlight          sets --spot-x / --spot-y on pointer move for a cursor-following highlight.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let observer: IntersectionObserver | undefined
function revealObserver() {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const el = entry.target as HTMLElement
      el.classList.add('revealed')
      observer!.unobserve(el)
      // Hand transitions back to the component (hover effects etc.) once the reveal is done.
      const delay = Number.parseInt(el.style.getPropertyValue('--reveal-delay')) || 0
      window.setTimeout(() => {
        el.classList.remove('reveal', 'revealed')
        el.style.removeProperty('--reveal-delay')
      }, delay + 850)
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' })
  return observer
}

const reveal: Directive<HTMLElement, number | undefined> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    // Content already on screen at hydration stays as is (no flash of hidden content).
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return
    el.style.setProperty('--reveal-delay', `${binding.value ?? 0}ms`)
    el.classList.add('reveal')
    revealObserver().observe(el)
  },
  beforeUnmount(el) {
    observer?.unobserve(el)
  },
}

const spotlightHandlers = new WeakMap<HTMLElement, (event: PointerEvent) => void>()

const spotlight: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted(el) {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    el.classList.add('spotlight')
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
      el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    }
    spotlightHandlers.set(el, onMove)
    el.addEventListener('pointermove', onMove, { passive: true })
  },
  beforeUnmount(el) {
    const onMove = spotlightHandlers.get(el)
    if (onMove) el.removeEventListener('pointermove', onMove)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
  nuxtApp.vueApp.directive('spotlight', spotlight)
})
