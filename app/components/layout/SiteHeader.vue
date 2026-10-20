<script setup lang="ts">
const routes = useSiteRoutes()
const menuOpen = ref(false)
const scrolled = ref(false)

const links = computed(() => [
  { label: 'nav.services', to: routes.value.services },
  { label: 'nav.cases', to: `${routes.value.home}#casos` },
  { label: 'nav.about', to: routes.value.about },
])

function updateScrolled() {
  scrolled.value = window.scrollY > 8
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
  <header class="site-header" :class="{ 'site-header--scrolled': scrolled || menuOpen }">
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
          :aria-label="menuOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
          @click="menuOpen = !menuOpen"
        >
          <span :class="{ open: menuOpen }" />
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
  height: var(--header-height);
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-base);
}

/* The blur lives on a pseudo-element: a backdrop-filter on the header itself would become
   the containing block of the fixed mobile menu and clip it to the header's height. */
.site-header::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: rgba(5, 7, 13, 0.72);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  content: '';
  transition: background var(--transition-base);
}

.site-header--scrolled {
  border-color: var(--color-border);
}

.site-header--scrolled::before {
  background: rgba(5, 7, 13, 0.94);
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
  gap: var(--space-6);
}

.site-header__logo {
  flex-shrink: 0;
  transform-origin: left center;
  transition: transform 0.35s var(--ease-out);
}

/* Slightly smaller logo and a soft shadow once the page scrolls (no layout shift). */
.site-header--scrolled .site-header__logo {
  transform: scale(0.9);
}

.site-header--scrolled {
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 30px -18px rgba(0, 0, 0, 0.8);
}

.site-header__nav {
  gap: var(--space-8);
}

.site-header__nav a {
  position: relative;
  padding: var(--space-2) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.site-header__nav a::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--color-accent);
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.site-header__nav a:hover,
.site-header__nav a.router-link-exact-active:not([href*="#"]) {
  color: var(--color-text-primary);
}

.site-header__nav a:hover::after,
.site-header__nav a.router-link-exact-active:not([href*="#"])::after {
  transform: scaleX(1);
}

.site-header__actions {
  gap: var(--space-5);
}

.site-header__menu {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
}

.site-header__menu span,
.site-header__menu span::before,
.site-header__menu span::after {
  display: block;
  width: 1.1rem;
  height: 2px;
  border-radius: 2px;
  background: currentcolor;
  transition: transform var(--transition-base), background var(--transition-base);
}

.site-header__menu span {
  position: relative;
}

.site-header__menu span::before,
.site-header__menu span::after {
  position: absolute;
  left: 0;
  content: '';
}

.site-header__menu span::before { top: -6px; }
.site-header__menu span::after { top: 6px; }

.site-header__menu span.open { background: transparent; }
.site-header__menu span.open::before { transform: translateY(6px) rotate(45deg); }
.site-header__menu span.open::after { transform: translateY(-6px) rotate(-45deg); }

@media (max-width: 880px) {
  .site-header__nav,
  .site-header__cta,
  .site-header__language {
    display: none;
  }

  .site-header__menu {
    display: grid;
  }
}
</style>
