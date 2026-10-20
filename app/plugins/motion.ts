import type { Directive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { prefersReducedMotion } from '~/utils/motion'

/**
 * Site motion (client only; prerendered HTML is always fully visible without JavaScript).
 *
 * Two levels, chosen from prefers-reduced-motion:
 * - full:  smooth scrolling (Lenis), blur + rise reveals, word-by-word headings, parallax,
 *          scrubbed section and card transitions.
 * - soft:  (reduce) the same reveals as short fades with a small rise, lighter smooth scrolling;
 *          no parallax, no scaling, nothing flashing. Motion stays visible on purpose.
 *
 * Directives:
 * v-reveal="delayMs"        fade/rise (+ blur) when the element scrolls into view.
 * v-reveal-words             staggers the `.word__inner` spans rendered by AccentText.
 * v-scrub-words              words light up one by one while the element crosses the viewport.
 * v-parallax="amount"        moves the element by `amount`% of its height while its parent scrolls past.
 * v-section-in               the block grows from a rounded inset card to full width as it enters.
 * v-spotlight                cursor-following highlight (sets --spot-x / --spot-y).
 */
gsap.registerPlugin(ScrollTrigger)

// One cleanup per directive and element (an element can carry several directives).
const cleanups = new WeakMap<HTMLElement, Map<string, () => void>>()

function track(el: HTMLElement, name: string, cleanup: () => void) {
  const map = cleanups.get(el) ?? new Map<string, () => void>()
  map.get(name)?.()
  map.set(name, cleanup)
  cleanups.set(el, map)
}

function untrack(name: string) {
  return (el: HTMLElement) => {
    cleanups.get(el)?.get(name)?.()
    cleanups.get(el)?.delete(name)
  }
}

const reveal: Directive<HTMLElement, number | undefined> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    const soft = prefersReducedMotion()
    const tween = gsap.from(el, {
      autoAlpha: 0,
      y: soft ? 14 : 44,
      filter: soft ? 'none' : 'blur(10px)',
      duration: soft ? 0.7 : 1.1,
      delay: (binding.value ?? 0) / 1000,
      ease: 'power3.out',
      clearProps: 'filter,transform,opacity,visibility',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
    track(el, 'reveal', () => tween.scrollTrigger?.kill() ?? tween.kill())
  },
  beforeUnmount: untrack('reveal'),
}

const revealWords: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted(el) {
    const words = el.querySelectorAll('.word__inner')
    if (!words.length) return
    const soft = prefersReducedMotion()
    const tween = gsap.from(words, {
      yPercent: soft ? 40 : 110,
      autoAlpha: soft ? 0 : 1,
      duration: soft ? 0.6 : 0.9,
      stagger: soft ? 0.03 : 0.045,
      ease: 'power4.out',
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
    track(el, 'revealWords', () => tween.scrollTrigger?.kill() ?? tween.kill())
  },
  beforeUnmount: untrack('revealWords'),
}

const scrubWords: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted(el) {
    const words = el.querySelectorAll('.word__inner')
    if (!words.length) return
    const tween = gsap.fromTo(words, { opacity: 0.18 }, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true },
    })
    track(el, 'scrubWords', () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(words, { clearProps: 'opacity' })
    })
  },
  beforeUnmount: untrack('scrubWords'),
}

const parallax: Directive<HTMLElement, number | undefined> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    if (prefersReducedMotion()) return
    const amount = binding.value ?? 15
    const tween = gsap.fromTo(el, { yPercent: -amount / 2 }, {
      yPercent: amount / 2,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    track(el, 'parallax', () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
  },
  beforeUnmount: untrack('parallax'),
}

const sectionIn: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted(el) {
    if (prefersReducedMotion()) return
    const tween = gsap.fromTo(el, { clipPath: 'inset(0% 4% round 2rem)' }, {
      clipPath: 'inset(0% 0% round 0rem)',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true },
    })
    track(el, 'sectionIn', () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(el, { clearProps: 'clipPath' })
    })
  },
  beforeUnmount: untrack('sectionIn'),
}

const spotlight: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted(el) {
    if (!window.matchMedia('(pointer: fine)').matches) return
    el.classList.add('spotlight')
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
      el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    track(el, 'spotlight', () => el.removeEventListener('pointermove', onMove))
  },
  beforeUnmount: untrack('spotlight'),
}

function startSmoothScroll() {
  // Soft level: a higher lerp settles faster, so the scroll feels smooth but stays close to the wheel.
  const lenis = new Lenis({ lerp: prefersReducedMotion() ? 0.2 : 0.1, anchors: { offset: -80 } })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  // The mobile menu locks the page through a body class; stop smooth scrolling meanwhile.
  new MutationObserver(() => {
    if (document.body.classList.contains('nav-open')) lenis.stop()
    else lenis.start()
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] })
  // Lenis handles in-page anchors itself, which skips the native focus move: keep the skip link
  // (and any other #anchor) moving keyboard focus to its target.
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
    const target = link && link.hash.length > 1 ? document.getElementById(decodeURIComponent(link.hash.slice(1))) : null
    if (!target) return
    if (!target.hasAttribute('tabindex') && !target.matches('a, button, input, select, textarea')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
  nuxtApp.vueApp.directive('reveal-words', revealWords)
  nuxtApp.vueApp.directive('scrub-words', scrubWords)
  nuxtApp.vueApp.directive('parallax', parallax)
  nuxtApp.vueApp.directive('section-in', sectionIn)
  nuxtApp.vueApp.directive('spotlight', spotlight)

  if (import.meta.server) return
  startSmoothScroll()
  // Layout changes after fonts/images load and after each page transition.
  window.addEventListener('load', () => ScrollTrigger.refresh())
  nuxtApp.hook('page:finish', () => {
    window.setTimeout(() => ScrollTrigger.refresh(), 350)
  })
})
