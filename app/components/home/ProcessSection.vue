<script setup lang="ts">
interface Step { number: string, title: string, description: string }
const steps = useTranslatedContent<Step[]>('process.steps')
</script>

<template>
  <section class="section surface-subtle process-section">
    <div class="container">
      <SectionHeading :eyebrow="$t('process.eyebrow')" :title="$t('process.sectionTitle')" :description="$t('process.sectionSubtitle')" align="center" />
      <!-- Sticky cards stack on top of each other while scrolling (pure CSS). -->
      <ol class="process">
        <li v-for="(step, index) in steps" :key="step.number" class="process__card" :style="{ '--stack-index': index }">
          <div class="process__text">
            <h3>{{ step.title }}</h3>
            <p class="process__description">{{ step.description }}</p>
          </div>
          <span class="process__number" aria-hidden="true">{{ step.number }}</span>
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
  gap: var(--space-6);
  max-width: 64rem;
  margin: 0 auto;
  list-style: none;
}

.process__card {
  position: sticky;
  top: calc(var(--header-height) + var(--space-6) + var(--stack-index) * 1.25rem);
  display: flex;
  min-height: 17rem;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-8);
  padding: clamp(1.75rem, 4vw, 3rem);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(ellipse 60% 90% at 100% 0%, rgba(37, 99, 235, 0.18), transparent 70%),
    #0F1526;
  box-shadow: 0 -20px 50px -30px rgba(0, 0, 0, 0.9);
  transition: box-shadow var(--transition-base), border-color var(--transition-base);
}

.process__card:hover {
  border-color: var(--color-accent-line);
  box-shadow: 0 -20px 50px -30px rgba(0, 0, 0, 0.9), var(--glow-accent);
}

.process__text {
  max-width: 34rem;
}

.process__card h3 {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3.4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.05;
}

.process__description {
  margin-top: var(--space-6);
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.process__number {
  background: linear-gradient(180deg, #8DB0FF, rgba(91, 140, 255, 0.35));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: var(--font-heading);
  font-size: clamp(3.5rem, 9vw, 6.5rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 0.85;
}

@media (max-width: 640px) {
  .process__card {
    min-height: 0;
    flex-direction: column-reverse;
    gap: var(--space-4);
  }
}
</style>
