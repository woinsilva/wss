<script setup lang="ts">
const highlights = useTranslatedContent<string[]>('founder.highlights')
const routes = useSiteRoutes()
const { trackLinkedInClicked } = useAnalytics()
const { locale } = useI18n()
const props = withDefaults(defineProps<{ showAboutLink?: boolean }>(), { showAboutLink: true })
</script>

<template>
  <section class="section surface-subtle founder">
    <div class="container founder__grid">
      <div v-reveal class="founder__card">
        <div class="founder__monogram" aria-hidden="true">WS</div>
        <p class="founder__name">{{ $t('founder.name') }}</p>
        <p class="founder__role">{{ $t('founder.role') }}</p>
        <a :href="$t('founder.linkedinUrl')" target="_blank" rel="noopener" class="founder__linkedin" @click="trackLinkedInClicked('founder', locale)">
          <AppIcon name="linkedin" /> {{ $t('founder.linkedinCta') }} <AppIcon name="external" />
        </a>
      </div>

      <div>
        <SectionHeading :eyebrow="$t('founder.eyebrow')" :title="$t('founder.sectionTitle')" />
        <p class="founder__bio">{{ $t('founder.bio') }}</p>
        <ul class="founder__highlights">
          <li v-for="(item, index) in highlights" :key="item" v-reveal="index * 80"><AppIcon name="check" />{{ item }}</li>
        </ul>
        <NuxtLink v-if="props.showAboutLink" :to="routes.about" class="text-link founder__more">{{ $t('founder.aboutCta') }} <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.founder {
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.founder__grid {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  align-items: start;
  gap: var(--space-16);
}

.founder__card {
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-md);
}

.founder__monogram {
  display: grid;
  width: 100%;
  aspect-ratio: 4 / 3;
  place-items: center;
  border-radius: var(--radius-md);
  background:
    radial-gradient(circle at 30% 20%, rgba(91, 140, 255, 0.35), transparent 55%),
    var(--color-navy);
  color: #fff;
  font-family: var(--font-heading);
  font-size: clamp(3.5rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.founder__name {
  margin-top: var(--space-6);
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.founder__role {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.founder__linkedin {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.founder__linkedin :deep(.app-icon) {
  width: 1rem;
  height: 1rem;
}

.founder .section-heading {
  margin-bottom: var(--space-6);
}

.founder__bio {
  max-width: 42rem;
  font-size: var(--font-size-lg);
}

.founder__highlights {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  list-style: none;
}

.founder__highlights li {
  display: flex;
  gap: var(--space-3);
  color: var(--color-text-primary);
}

.founder__highlights :deep(.app-icon) {
  margin-top: 0.2rem;
  color: var(--color-accent);
}

.founder__more {
  margin-top: var(--space-8);
}

@media (max-width: 900px) {
  .founder__grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  .founder__card {
    max-width: 26rem;
    order: 2;
  }
}
</style>
