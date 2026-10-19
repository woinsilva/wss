<script setup lang="ts">
import { featuredServices } from '~/data/services'

const routes = useSiteRoutes()
const serviceLink = useServiceLink()
const year = new Date().getFullYear()
const { trackLinkedInClicked } = useAnalytics()
const { locale, t } = useI18n()

const companyLinks = computed(() => [
  { label: 'footer.links.services', to: routes.value.services },
  { label: 'footer.links.about', to: routes.value.about },
  { label: 'footer.links.quote', to: routes.value.quote },
])

const serviceLinks = computed(() => featuredServices.slice(0, 5).map(service => ({
  label: t(`services.items.${service.content}.title`),
  to: serviceLink(service.key),
})))
</script>

<template>
  <footer class="site-footer surface-dark">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        <AppLogo variant="dark" class="site-footer__logo" />
        <p>{{ $t('footer.description') }}</p>
      </div>

      <nav class="site-footer__col" :aria-label="$t('footer.navTitle')">
        <h2>{{ $t('footer.navTitle') }}</h2>
        <NuxtLink v-for="link in companyLinks" :key="link.label" :to="link.to">{{ $t(link.label) }}</NuxtLink>
      </nav>

      <nav class="site-footer__col" :aria-label="$t('footer.servicesTitle')">
        <h2>{{ $t('footer.servicesTitle') }}</h2>
        <NuxtLink v-for="link in serviceLinks" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
      </nav>

      <div class="site-footer__col">
        <h2>{{ $t('footer.contactTitle') }}</h2>
        <a href="mailto:wssitconsultoria@gmail.com" class="site-footer__icon-link"><AppIcon name="mail" />{{ $t('footer.email') }}</a>
        <a :href="$t('founder.linkedinUrl')" target="_blank" rel="noopener" class="site-footer__icon-link" @click="trackLinkedInClicked('footer', locale)"><AppIcon name="linkedin" />{{ $t('footer.linkedin') }}</a>
        <p class="site-footer__icon-link"><AppIcon name="pin" />{{ $t('footer.location') }}</p>
      </div>
    </div>

    <div class="container">
      <div class="site-footer__bottom">
        <p>{{ $t('footer.copyright', { year }) }} · {{ $t('footer.company') }} · {{ $t('footer.cnpj') }}</p>
        <div>
          <NuxtLink :to="routes.privacy">{{ $t('footer.links.privacy') }}</NuxtLink>
          <NuxtLink :to="routes.terms">{{ $t('footer.links.terms') }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: var(--space-20) 0 var(--space-8);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.3fr 1.3fr;
  gap: var(--space-12);
}

.site-footer__brand .site-footer__logo {
  height: 4.25rem;
}

@media (max-width: 640px) {
  .site-footer__brand .site-footer__logo {
    height: 3.5rem;
  }
}

.site-footer__brand p {
  max-width: 22rem;
  margin-top: var(--space-6);
  color: var(--color-text-muted);
}

.site-footer__col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.site-footer__col h2 {
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.site-footer__col a,
.site-footer__col p {
  color: var(--color-text-secondary);
}

.site-footer__col a:hover {
  color: var(--color-text-primary);
}

.site-footer__icon-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.site-footer__icon-link :deep(.app-icon) {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-muted);
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: var(--space-16);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

.site-footer__bottom div {
  display: flex;
  gap: var(--space-6);
}

.site-footer__bottom a {
  color: var(--color-text-muted);
}

.site-footer__bottom a:hover {
  color: var(--color-text-primary);
}

@media (max-width: 960px) {
  .site-footer__grid {
    grid-template-columns: 1fr 1fr;
  }

  .site-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .site-footer {
    padding-top: var(--space-16);
  }

  .site-footer__grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }
}
</style>
