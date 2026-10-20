<script setup lang="ts">
interface Study { title: string, sector: string, problem: string, solution: string, result?: string, highlight: string, technologies: string[] }
const content = useTranslatedContent<Record<string, Study>>('cases.items')
const studies = computed(() => Object.entries(content.value).map(([key, study]) => ({ key, ...study })))
</script>

<template>
  <section id="casos" class="section">
    <div class="container">
      <SectionHeading :eyebrow="$t('cases.eyebrow')" :title="$t('cases.sectionTitle')" :description="$t('cases.sectionSubtitle')" />
      <div class="cases">
        <article v-for="(study, index) in studies" :key="study.key" v-reveal="(index % 3) * 100" v-spotlight class="case">
          <p class="case__sector">{{ study.sector }}</p>
          <h3>{{ study.title }}</h3>
          <div class="case__highlight">
            <span>{{ $t('cases.resultLabel') }}</span>
            <p>{{ study.highlight }}</p>
          </div>
          <details class="case__details">
            <summary>{{ $t('cases.readMore') }}</summary>
            <div class="case__body">
              <div>
                <h4>{{ $t('cases.contextLabel') }}</h4>
                <p>{{ study.problem }}</p>
              </div>
              <div>
                <h4>{{ $t('cases.solutionLabel') }}</h4>
                <p>{{ study.solution }}</p>
              </div>
              <div v-if="study.result">
                <h4>{{ $t('cases.resultLabel') }}</h4>
                <p>{{ study.result }}</p>
              </div>
            </div>
          </details>
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

/* Five cases: the first one spans two columns so both rows are full. */
.case:first-child {
  grid-column: span 2;
}

@media (max-width: 1024px) {
  .cases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .cases {
    grid-template-columns: 1fr;
  }

  .case:first-child {
    grid-column: auto;
  }
}

.case {
  display: flex;
  flex-direction: column;
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-primary);
  transition: border-color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base);
}

.case:hover {
  border-color: var(--color-accent-line);
  box-shadow: var(--glow-accent);
  transform: translateY(-4px);
}

.case__sector {
  color: var(--color-accent);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.case h3 {
  margin-top: var(--space-3);
}

.case__highlight {
  margin-top: var(--space-6);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-accent-soft), rgba(124, 58, 237, 0.06));
}

.case__highlight span {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.case__highlight p {
  margin-top: var(--space-2);
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: clamp(1.15rem, 1.6vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.case__details {
  margin-top: var(--space-5);
}

.case__details summary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  list-style: none;
  cursor: pointer;
}

.case__details summary::-webkit-details-marker {
  display: none;
}

.case__details summary::after {
  color: var(--color-accent);
  content: '+';
  transition: transform var(--transition-base);
}

.case__details[open] summary::after {
  transform: rotate(45deg);
}

.case__details summary:hover {
  color: var(--color-accent);
}

.case__body {
  display: grid;
  gap: var(--space-4);
  padding-top: var(--space-4);
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

.case__stack {
  margin-top: auto;
  padding-top: var(--space-6);
}

@media (max-width: 480px) {
  .case {
    padding: var(--space-6);
  }
}
</style>
