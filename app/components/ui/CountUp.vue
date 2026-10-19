<script setup lang="ts">
/**
 * Renders a value like "13+" and counts the leading number up from zero when it scrolls into view.
 * SSR and reduced-motion users get the final value; non-numeric values render as-is.
 */
const props = defineProps<{ value: string }>()
const match = computed(() => props.value.match(/^(\d+)(.*)$/))
const display = ref(props.value)
const el = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let frame = 0

function run(target: number, suffix: string) {
  const duration = 1400
  const start = performance.now()
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - (1 - progress) ** 4
    display.value = `${Math.round(target * eased)}${suffix}`
    if (progress < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  const m = match.value
  if (!m || !el.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  const rect = el.value.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) return
  const target = Number(m[1])
  const suffix = m[2] ?? ''
  display.value = `0${suffix}`
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    observer?.disconnect()
    run(target, suffix)
  }, { threshold: 0.6 })
  observer.observe(el.value)
})

onUnmounted(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <span ref="el" class="count-up" :aria-label="value">{{ display }}</span>
</template>

<style scoped>
.count-up {
  font-variant-numeric: tabular-nums;
}
</style>
