<script setup lang="ts">
interface ProofItem { value: string, label: string }
const items = useTranslatedContent<ProofItem[]>('proof.items')
</script>

<template>
  <section class="proof surface-dark">
    <div class="container">
      <ul class="proof__list">
        <li v-for="(item, index) in items" :key="item.label" v-reveal="index * 90">
          <strong><CountUp :value="item.value" /></strong>
          <span class="proof__label">{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.proof {
  padding: var(--space-12) 0;
}

.proof__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
}

.proof__list li {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-8);
  border-left: 1px solid var(--color-border);
}

.proof__list li:first-child {
  padding-left: 0;
  border-left: 0;
}

.proof__list strong {
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.proof__label {
  max-width: 14rem;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

@media (max-width: 860px) {
  .proof__list {
    grid-template-columns: repeat(2, 1fr);
    row-gap: var(--space-8);
  }

  .proof__list li:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }
}

@media (max-width: 420px) {
  .proof__list li {
    padding: 0 var(--space-4);
  }
}
</style>
