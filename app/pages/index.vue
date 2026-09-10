<script setup lang="ts">
const routes = useSiteRoutes()
</script>

<template>
  <section class="section">
    <div class="container">
      <SectionHeading
        :eyebrow="$t('footer.tagline')"
        :title="$t('hero.headline')"
        :description="$t('hero.subheadline')"
      />
      <AppButton :to="routes.quote" size="large">
        {{ $t('hero.primaryCta') }}
      </AppButton>
    </div>
  </section>
</template>
