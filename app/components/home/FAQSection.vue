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

@media (max-width: 900px) {
  .faq {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
