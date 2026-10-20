<script setup lang="ts">
interface Faq { question: string, answer: string }
const items = useTranslatedContent<Faq[]>('faq.items')
</script>

<template>
  <section class="section">
    <div class="container faq">
      <SectionHeading :eyebrow="$t('faq.eyebrow')" :title="$t('faq.sectionTitle')" :description="$t('faq.sectionSubtitle')" />
      <div class="faq-list">
        <details v-for="(item, index) in items" :key="item.question" v-reveal="index * 60">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: var(--space-16);
}

/* Boxed accordion rows. */
.faq-list {
  display: grid;
  gap: var(--space-3);
}

.faq-list details,
.faq-list details:first-child {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.faq-list details:hover {
  border-color: var(--color-border-hover);
}

.faq-list details[open] {
  border-color: var(--color-accent-line);
  box-shadow: var(--shadow-md);
}

.faq-list :deep(summary) {
  padding: var(--space-5) 4rem var(--space-5) var(--space-6);
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  font-weight: 600;
  letter-spacing: 0;
}

.faq-list :deep(summary::after) {
  right: var(--space-5);
}

.faq-list details p {
  padding: 0 var(--space-6) var(--space-6);
}

@media (max-width: 900px) {
  .faq {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
