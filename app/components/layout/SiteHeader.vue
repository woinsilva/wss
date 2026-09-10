<script setup lang="ts">
const routes = useSiteRoutes()
const menuOpen = ref(false)
const scrolled = ref(false)

const links = computed(() => [
  { label: 'nav.services', to: routes.value.services },
  { label: 'nav.about', to: routes.value.about },
])

function updateScrolled() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  updateScrolled()
  window.addEventListener('scroll', updateScrolled, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', updateScrolled))

const route = useRoute()
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <header class="site-header" :class="{ 'site-header--scrolled': scrolled }">
    <div class="container site-header__inner">
      <NuxtLink :to="routes.home" class="site-header__logo">
        <AppLogo />
      </NuxtLink>

      <nav class="site-header__nav" :aria-label="$t('nav.expertise')">
        <NuxtLink v-for="link in links" :key="link.label" :to="link.to">
          {{ $t(link.label) }}
        </NuxtLink>
      </nav>

      <div class="site-header__actions">
        <LanguageSwitcher class="site-header__language" />
        <AppButton :to="routes.quote" class="site-header__cta">
          {{ $t('nav.quote') }}
        </AppButton>
        <button
          class="site-header__menu"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>
    <MobileNavigation id="mobile-navigation" :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  z-index: var(--z-sticky);
  top: 0;
  height: 4.5rem;
  border-bottom: 1px solid transparent;
  background: rgba(8, 11, 18, 0.72);
  backdrop-filter: blur(16px);
  transition: border-color var(--transition-base), background var(--transition-base);
}

.site-header--scrolled {
  border-color: var(--color-border);
  background: rgba(8, 11, 18, 0.94);
}

.site-header__inner,
.site-header__actions,
.site-header__nav {
  display: flex;
  align-items: center;
}

.site-header__inner {
  height: 100%;
  justify-content: space-between;
}

.site-header__logo {
  color: inherit;
}

.site-header__nav {
  gap: var(--space-8);
}

.site-header__nav a {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.site-header__nav a:hover,
.site-header__nav a.router-link-active {
  color: var(--color-text-primary);
}

.site-header__actions {
  gap: var(--space-4);
}

.site-header__menu {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
}

.site-header__menu span {
  display: block;
  width: 1.1rem;
  height: 2px;
  margin: 4px auto;
  background: currentcolor;
}

@media (max-width: 840px) {
  .site-header__nav,
  .site-header__cta,
  .site-header__language {
    display: none;
  }

  .site-header__menu {
    display: block;
  }
}
</style>
