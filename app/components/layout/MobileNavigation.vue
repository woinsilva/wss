<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const panel = ref<HTMLElement | null>(null)
const routes = useSiteRoutes()

const links = computed(() => [
  { label: 'nav.services', to: routes.value.services },
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
  <Transition name="menu">
    <div v-if="open" class="mobile-nav" @click.self="emit('close')">
      <nav ref="panel" class="mobile-nav__panel" aria-label="Mobile">
        <NuxtLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          @click="emit('close')"
        >
          {{ $t(link.label) }}
        </NuxtLink>
        <AppButton :to="routes.quote" size="large" @click="emit('close')">
          {{ $t('nav.quote') }}
        </AppButton>
        <LanguageSwitcher />
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  z-index: var(--z-overlay);
  inset: 4.5rem 0 0;
  display: flex;
  justify-content: flex-end;
  background: rgba(8, 11, 18, 0.78);
  backdrop-filter: blur(8px);
}

.mobile-nav__panel {
  display: flex;
  width: min(88vw, 24rem);
  height: 100%;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-10) var(--space-6);
  border-left: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.mobile-nav__panel > a:not(.btn) {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: 650;
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
  transform: translateX(100%);
}
</style>
