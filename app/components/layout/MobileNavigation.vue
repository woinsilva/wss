<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const panel = ref<HTMLElement | null>(null)
const routes = useSiteRoutes()

const links = computed(() => [
  { label: 'nav.services', to: routes.value.services },
  { label: 'nav.cases', to: `${routes.value.home}#casos` },
  { label: 'nav.about', to: routes.value.about },
])

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  if (event.key !== 'Tab' || !panel.value) return

  const focusable = [...panel.value.querySelectorAll<HTMLElement>('a, button')]
  const first = focusable[0]
  const last = focusable.at(-1)
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (open) => {
  document.body.classList.toggle('nav-open', open)
  if (open) {
    await nextTick()
    panel.value?.querySelector<HTMLElement>('a')?.focus()
  }
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('nav-open')
})
</script>

<template>
  <Transition name="menu" :duration="{ enter: 650, leave: 220 }">
    <div v-if="open" class="mobile-nav" data-lenis-prevent @click.self="emit('close')">
      <nav ref="panel" class="mobile-nav__panel" aria-label="Mobile">
        <NuxtLink
          v-for="(link, index) in links"
          :key="link.label"
          :to="link.to"
          class="mobile-nav__link"
          :style="{ '--i': index }"
          @click="emit('close')"
        >
          {{ $t(link.label) }}
          <span aria-hidden="true">→</span>
        </NuxtLink>
        <div class="mobile-nav__footer" :style="{ '--i': links.length }">
          <AppButton :to="routes.quote" size="large" @click="emit('close')">
            {{ $t('nav.quote') }}
          </AppButton>
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  z-index: var(--z-overlay);
  inset: var(--header-height) 0 0;
  background: rgba(11, 18, 32, 0.32);
}

.mobile-nav__panel {
  display: flex;
  max-height: 100%;
  flex-direction: column;
  overflow-y: auto;
  padding: var(--space-4) var(--space-5) var(--space-8);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-lg);
}

.mobile-nav__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.mobile-nav__link span {
  color: var(--color-text-muted);
}

.mobile-nav__footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-5);
  margin-top: var(--space-8);
}

.mobile-nav__footer :deep(.language-switcher) {
  align-self: center;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity var(--transition-base);
}

.menu-enter-active .mobile-nav__panel,
.menu-leave-active .mobile-nav__panel {
  transition: transform var(--transition-base);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-from .mobile-nav__panel,
.menu-leave-to .mobile-nav__panel {
  transform: translateY(-0.75rem);
}

/* Links slide in one after another. */
.menu-enter-active .mobile-nav__link,
.menu-enter-active .mobile-nav__footer {
  transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
  transition-delay: calc(60ms + var(--i) * 55ms);
}

.menu-enter-from .mobile-nav__link,
.menu-enter-from .mobile-nav__footer {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-nav__link span {
  transition: transform var(--transition-fast), color var(--transition-fast);
}

.mobile-nav__link:hover span {
  color: var(--color-accent);
  transform: translateX(4px);
}
</style>
