<script setup lang="ts">
interface Study { title: string, sector: string, problem: string, solution: string, result?: string, technologies: string[] }
const content = useTranslatedContent<Record<string, Study>>('cases.items')
const studies = computed(() => Object.entries(content.value).map(([key, study], index) => ({
  key,
  number: String(index + 1).padStart(2, '0'),
  ...study,
})))
</script>

<template>
  <section id="casos" class="section">
    <div class="container">
      <SectionHeading :eyebrow="$t('cases.eyebrow')" :title="$t('cases.sectionTitle')" :description="$t('cases.sectionSubtitle')" />
      <div class="cases">
        <article v-for="(study, index) in studies" :key="study.key" v-reveal="index === 0 ? 0 : ((index - 1) % 2) * 100" v-spotlight class="case" :class="{ 'case--featured': index === 0 && studies.length % 2 === 1 }">
          <header class="case__head">
            <span class="case__number">{{ study.number }}</span>
            <p class="case__sector">{{ study.sector }}</p>
            <h3>{{ study.title }}</h3>
          </header>
          <div class="case__body">
            <div>
              <h4>{{ $t('cases.contextLabel') }}</h4>
              <p>{{ study.problem }}</p>
            </div>
            <div>
              <h4>{{ $t('cases.solutionLabel') }}</h4>
              <p>{{ study.solution }}</p>
            </div>
            <div v-if="study.result" class="case__result">
              <h4>{{ $t('cases.resultLabel') }}</h4>
              <p>{{ study.result }}</p>
            </div>
          </div>
          <ul class="tag-list case__stack" :aria-label="$t('cases.stackLabel')">
            <TechChip v-for="tech in study.technologies" :key="tech" :label="tech" />
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cases {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.case {
  display: flex;
  flex-direction: column;
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.case:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.case__head {
  position: relative;
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.case__number {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
}

.case__sector {
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.case__head h3 {
  margin-top: var(--space-3);
  padding-right: var(--space-8);
}

.case__body {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-6) 0;
}

.case__body h4 {
  margin-bottom: var(--space-1);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: 0;
}

.case__body p {
  font-size: var(--font-size-sm);
}

.case__result {
  padding: var(--space-4) var(--space-5);
  border-left: 3px solid var(--color-accent);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background: var(--color-accent-soft);
}

.case__result p {
  color: var(--color-text-primary);
  font-weight: 500;
}

.case__stack {
  margin-top: auto;
}

@media (min-width: 861px) {
  .case--featured {
    grid-column: 1 / -1;
  }

  .case--featured .case__body {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  .case--featured .case__result {
    align-self: start;
  }
}

@media (max-width: 860px) {
  .cases {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .case {
    padding: var(--space-6);
  }
}
</style>
