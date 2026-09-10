<script setup lang="ts">
const routes = useSiteRoutes()
const year = new Date().getFullYear()

const links = computed(() => [
  { label: 'footer.links.services', to: routes.value.services },
  { label: 'footer.links.solutions', to: routes.value.solutions },
  { label: 'footer.links.about', to: routes.value.about },
  { label: 'footer.links.quote', to: routes.value.quote },
  { label: 'footer.links.privacy', to: routes.value.privacy },
  { label: 'footer.links.terms', to: routes.value.terms },
])
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        <AppLogo />
        <p>{{ $t('footer.tagline') }}</p>
        <p>{{ $t('footer.location') }}</p>
      </div>
      <nav class="site-footer__links" :aria-label="$t('nav.expertise')">
        <NuxtLink v-for="link in links" :key="link.label" :to="link.to">
          {{ $t(link.label) }}
        </NuxtLink>
      </nav>
      <div class="site-footer__contact">
        <a href="mailto:wssitconsultoria@gmail.com">{{ $t('footer.email') }}</a>
        <p>{{ $t('footer.company') }}</p>
        <p>{{ $t('footer.cnpj') }}</p>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <p>{{ $t('footer.copyright', { year }) }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: var(--space-16) 0 var(--space-8);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: var(--space-12);
}

.site-footer__brand,
.site-footer__contact,
.site-footer__links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.site-footer__brand > p:first-of-type {
  color: var(--color-accent-cyan);
}

.site-footer__links a {
  color: var(--color-text-secondary);
}

.site-footer__contact {
  font-size: var(--font-size-sm);
}

.site-footer__bottom {
  margin-top: var(--space-12);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}

@media (max-width: 760px) {
  .site-footer__grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
</style>
