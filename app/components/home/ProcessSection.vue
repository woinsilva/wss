<script setup lang="ts">
interface Step { number: string, title: string, description: string }
const steps = useTranslatedContent<Step[]>('process.steps')
</script>

<template>
  <section class="section surface-subtle process-section">
    <div class="container">
      <SectionHeading :eyebrow="$t('process.eyebrow')" :title="$t('process.sectionTitle')" :description="$t('process.sectionSubtitle')" />
      <ol class="process">
        <li v-for="(step, index) in steps" :key="step.number" v-reveal="index * 100">
          <span class="process__number">{{ step.number }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.process-section {
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.process {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-6);
  list-style: none;
}

.process li {
  position: relative;
  padding-top: var(--space-8);
}

.process li::before {
  position: absolute;
  top: 0.95rem;
  right: calc(-1 * var(--space-6));
  left: 0;
  height: 1px;
  background: var(--color-border-hover);
  content: '';
}

.process li:last-child::before {
  right: 0;
}

.process__number {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  background: var(--color-bg-surface);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
}

.process h3 {
  margin-top: var(--space-5);
  font-size: var(--font-size-lg);
}

.process p {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
}

@media (max-width: 960px) {
  .process {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .process li {
    padding: 0 0 var(--space-8) var(--space-12);
  }

  .process li::before {
    top: 2rem;
    right: auto;
    bottom: 0;
    left: 1rem;
    width: 1px;
    height: auto;
  }

  .process li:last-child {
    padding-bottom: 0;
  }

  .process li:last-child::before {
    display: none;
  }

  .process h3 {
    margin-top: 0.2rem;
  }
}
</style>
