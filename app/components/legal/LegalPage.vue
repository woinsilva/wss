<script setup lang="ts">
defineProps<{ title: string, updated: string, sections: ReadonlyArray<readonly [string, string]> }>()
const routes = useSiteRoutes()
const { t } = useI18n()
</script>

<template>
  <article>
    <header class="page-hero">
      <div class="container">
        <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: routes.home }, { label: title }]" />
        <h1>{{ title }}</h1>
        <p class="legal__updated">{{ updated }}</p>
      </div>
    </header>
    <div class="section">
      <div class="container">
        <div class="legal__content">
          <section v-for="(section, index) in sections" :key="section[0]">
            <h2><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ section[0] }}</h2>
            <p>{{ section[1] }}</p>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.page-hero h1 { margin-top: var(--space-12); }
.legal__updated { margin-top: var(--space-4); color: var(--color-text-muted); font-size: var(--font-size-sm); }
.legal__content { max-width: 46rem; }
.legal__content section + section { margin-top: var(--space-10); padding-top: var(--space-10); border-top: 1px solid var(--color-border); }
.legal__content h2 { display: flex; align-items: baseline; gap: var(--space-4); margin-bottom: var(--space-4); font-size: var(--font-size-xl); }
.legal__content h2 span { color: var(--color-accent); font-family: var(--font-mono); font-size: var(--font-size-sm); font-weight: 500; }
</style>
