<script setup lang="ts">
interface Sector { key: string, name: string, detail: string, tags: string[] }
const sectors = useTranslatedContent<Sector[]>('sectors.items')
const activeKey = ref('')
const active = computed(() => sectors.value.find(sector => sector.key === activeKey.value) ?? sectors.value[0])
const tabs = ref<HTMLButtonElement[]>([])

function select(key: string) {
  activeKey.value = key
}

// Arrow keys move between tags, as in the WAI-ARIA tabs pattern.
function onKeydown(event: KeyboardEvent, index: number) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
  let next: number | undefined
  if (step) next = (index + step + sectors.value.length) % sectors.value.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = sectors.value.length - 1
  if (next === undefined) return
  event.preventDefault()
  select(sectors.value[next]!.key)
  tabs.value[next]?.focus()
}
</script>

<template>
  <section class="section sectors">
    <div class="container">
      <SectionHeading :eyebrow="$t('sectors.eyebrow')" :title="$t('sectors.title')" :description="$t('sectors.subtitle')" />
      <div class="sectors__layout">
        <div v-reveal class="sectors__tags" role="tablist" :aria-label="$t('sectors.listLabel')">
          <button
            v-for="(sector, index) in sectors"
            :id="`sector-tab-${sector.key}`"
            :key="sector.key"
            ref="tabs"
            type="button"
            role="tab"
            class="sectors__tag"
            :class="{ 'sectors__tag--active': active?.key === sector.key }"
            :aria-selected="active?.key === sector.key"
            aria-controls="sector-panel"
            :tabindex="active?.key === sector.key ? 0 : -1"
            @click="select(sector.key)"
            @keydown="onKeydown($event, index)"
          >
            {{ sector.name }}
          </button>
        </div>
        <div v-if="active" id="sector-panel" v-reveal="120" class="sectors__panel" role="tabpanel" :aria-labelledby="`sector-tab-${active.key}`">
          <Transition name="sector" mode="out-in">
            <div :key="active.key">
              <h3>{{ active.name }}</h3>
              <p>{{ active.detail }}</p>
              <ul class="tag-list">
                <TechChip v-for="tag in active.tags" :key="tag" :label="tag" />
              </ul>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sectors__layout {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: start;
  gap: var(--space-10);
}

.sectors__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.sectors__tag {
  padding: 0.65rem 1.15rem;
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-full);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform var(--transition-base);
}

.sectors__tag:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: translateY(-2px);
}

.sectors__tag--active,
.sectors__tag--active:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-strong);
  color: #FFFFFF;
}

.sectors__panel {
  min-height: 15rem;
  padding: clamp(1.75rem, 4vw, 2.75rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(ellipse 70% 80% at 100% 0%, var(--color-accent-soft), transparent 70%),
    var(--color-bg-primary);
  box-shadow: var(--shadow-md);
}

.sectors__panel h3 {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 700;
  color: var(--color-accent);
}

.sectors__panel p {
  margin-top: var(--space-4);
  font-size: var(--font-size-lg);
}

.sectors__panel .tag-list {
  margin-top: var(--space-6);
}

.sector-enter-active,
.sector-leave-active {
  transition: opacity 0.25s ease, transform 0.25s var(--ease-out);
}

.sector-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.sector-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .sectors__layout {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}
</style>
