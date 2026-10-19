<script setup lang="ts" generic="T">
/**
 * Infinite horizontal carousel.
 * - The list is repeated as many times as needed to always fill the viewport, so the first item
 *   follows the last one without a gap; copies are hidden from assistive tech.
 * - Driven by requestAnimationFrame once mounted (a CSS animation is the no-JS fallback).
 * - Click/touch and drag spins it like a roulette: it follows the pointer, keeps the fling speed and
 *   direction, then eases back to the normal speed and direction.
 * - Keeps running with prefers-reduced-motion (slower); it pauses on hover and while focused, and a
 *   keyboard-only pause button (invisible to mouse/touch users) covers WCAG 2.2.2.
 */
const props = withDefaults(defineProps<{ items: T[], itemKey: (item: T) => string, duration?: number, gap?: string }>(), {
  duration: 48,
  gap: 'var(--space-12)',
})

const paused = ref(false)
const copies = ref(2)
const viewport = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const driven = ref(false)
const dragging = ref(false)

let frame = 0
let lastTime = 0
let offset = 0
let velocity = 0
let listWidth = 0
let hovering = false
let focused = false
let flung = false
let lastX = 0
let lastMove = 0
let dragVelocity = 0
let resizeObserver: ResizeObserver | undefined

function baseSpeed() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return listWidth / (props.duration * (reduced ? 1.6 : 1))
}

function measure() {
  const first = inner.value?.querySelector<HTMLElement>('.marquee-track__list')
  if (!first || !viewport.value) return
  listWidth = first.offsetWidth
  if (listWidth > 0) copies.value = Math.max(2, Math.ceil(viewport.value.offsetWidth / listWidth) + 1)
}

function tick(time: number) {
  const dt = Math.min((time - (lastTime || time)) / 1000, 0.05)
  lastTime = time
  if (!dragging.value && listWidth > 0) {
    const stopped = paused.value || focused || (hovering && !flung)
    const target = stopped ? 0 : baseSpeed()
    // Exponential ease towards the target speed: the "roulette" slow-down after a fling.
    velocity += (target - velocity) * (1 - Math.exp(-dt * 1.4))
    offset += velocity * dt
  }
  if (listWidth > 0) {
    offset = ((offset % listWidth) + listWidth) % listWidth
    inner.value!.style.transform = `translate3d(${-offset}px, 0, 0)`
  }
  frame = requestAnimationFrame(tick)
}

function setFocused(value: boolean) {
  focused = value
}

function onPointerEnter(event: PointerEvent) {
  hovering = event.pointerType === 'mouse'
}

function onPointerLeave() {
  hovering = false
  flung = false
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  dragging.value = true
  flung = false
  lastX = event.clientX
  lastMove = performance.now()
  dragVelocity = 0
  viewport.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  const now = performance.now()
  const dx = event.clientX - lastX
  const dt = Math.max((now - lastMove) / 1000, 0.001)
  offset -= dx
  // Smoothed pointer speed (px/s); positive = content moving left.
  dragVelocity = dragVelocity * 0.6 + (-dx / dt) * 0.4
  lastX = event.clientX
  lastMove = now
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  viewport.value?.releasePointerCapture(event.pointerId)
  // A pause before letting go means no fling.
  const idle = performance.now() - lastMove > 120
  velocity = idle ? 0 : Math.max(-6000, Math.min(6000, dragVelocity))
  flung = Math.abs(velocity) > 40
}

onMounted(() => {
  driven.value = true
  nextTick(() => {
    measure()
    resizeObserver = new ResizeObserver(measure)
    if (viewport.value) resizeObserver.observe(viewport.value)
    if (inner.value?.firstElementChild) resizeObserver.observe(inner.value.firstElementChild)
    velocity = baseSpeed()
    frame = requestAnimationFrame(tick)
  })
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="marquee-track"
    :class="{ 'marquee-track--driven': driven, 'marquee-track--dragging': dragging }"
    :style="{ '--duration': `${duration}s`, '--gap': gap }"
    @focusin="setFocused(true)"
    @focusout="setFocused(false)"
  >
    <div
      ref="viewport"
      class="marquee-track__viewport"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @dragstart.prevent
    >
      <div ref="inner" class="marquee-track__inner">
        <ul v-for="copy in copies" :key="copy" class="marquee-track__list" :aria-hidden="copy > 1 ? 'true' : undefined">
          <li v-for="item in items" :key="itemKey(item)">
            <slot :item="item" />
          </li>
        </ul>
      </div>
    </div>
    <button
      type="button"
      class="marquee-track__toggle"
      :aria-pressed="paused"
      @click="paused = !paused"
    >
      {{ paused ? $t('marquee.resume') : $t('marquee.pause') }}
    </button>
  </div>
</template>

<style scoped>
.marquee-track {
  position: relative;
}

.marquee-track__viewport {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.marquee-track--dragging .marquee-track__viewport {
  cursor: grabbing;
}

.marquee-track__inner {
  display: flex;
  width: max-content;
  will-change: transform;
  /* No-JS fallback; replaced by the JS loop once mounted. */
  animation: marquee var(--duration) linear infinite;
}

.marquee-track--driven .marquee-track__inner {
  animation: none;
}

.marquee-track__list {
  display: flex;
  align-items: center;
  gap: var(--gap);
  padding-right: var(--gap);
  list-style: none;
}

.marquee-track__list > li {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.marquee-track__list :deep(img) {
  pointer-events: none;
  -webkit-user-drag: none;
}

/* Keyboard-only control: visually hidden until it receives keyboard focus (Tab). */
.marquee-track__toggle {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.marquee-track__toggle:focus-visible {
  top: 50%;
  right: max(var(--space-4), calc((100% - var(--container-max)) / 2));
  width: auto;
  height: auto;
  padding: var(--space-2) var(--space-4);
  overflow: visible;
  clip: auto;
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-full);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  font-weight: 600;
  transform: translateY(-50%);
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

/* Overrides the global reduced-motion reset for the no-JS fallback. */
@media (prefers-reduced-motion: reduce) {
  .marquee-track__inner {
    animation-duration: calc(var(--duration) * 1.6) !important;
    animation-iteration-count: infinite !important;
  }

  .marquee-track--driven .marquee-track__inner {
    animation: none !important;
  }
}
</style>
