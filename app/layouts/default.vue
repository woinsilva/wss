<template>
  <div class="site-shell">
    <a class="skip-nav" href="#main-content">{{ $t('nav.skipToContent') }}</a>
    <SiteHeader />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site-shell {
  min-height: 100vh;
}

main {
  min-height: 60vh;
}
</style>
