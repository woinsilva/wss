<script setup lang="ts">
interface Category { title: string, items: string[] }
const content = useTranslatedContent<Record<string, Category>>('tech.categories')
const categories = computed(() => Object.values(content.value))
</script>

<template>
  <section class="section">
    <div class="container">
      <SectionHeading :eyebrow="$t('tech.eyebrow')" :title="$t('tech.sectionTitle')" :description="$t('tech.sectionSubtitle')" />
      <div class="tech-grid">
        <article v-for="(category, index) in categories" :key="category.title" v-reveal="(index % 3) * 90" v-spotlight class="tech-card">
          <h3>{{ category.title }}</h3>
          <ul class="tag-list">
            <TechChip v-for="item in category.items" :key="item" :label="item" fallback />
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.tech-card {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.tech-card h3 {
  margin-bottom: var(--space-4);
  font-size: var(--font-size-base);
}

@media (max-width: 900px) {
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>
