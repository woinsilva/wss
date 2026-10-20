/** True when the visitor asked the OS for less motion; the site then uses its soft motion level. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
