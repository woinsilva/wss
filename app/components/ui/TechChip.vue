<script setup lang="ts">
import { techIcon, techMonogram } from '~/data/techIcons'

/** A stack chip with the brand icon (monochrome, brand color on hover). */
const props = withDefaults(defineProps<{ label: string, fallback?: boolean }>(), { fallback: false })
const icon = computed(() => techIcon(props.label))
</script>

<template>
  <li class="tag tech-chip" :style="icon ? { '--brand': `#${icon.hex}` } : undefined">
    <svg v-if="icon" class="tech-chip__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path :d="icon.path" /></svg>
    <span v-else-if="fallback" class="tech-chip__mono" aria-hidden="true">{{ techMonogram(label) }}</span>
    {{ label }}
  </li>
</template>

<style scoped>
.tech-chip {
  gap: 0.45rem;
  transition: border-color var(--transition-base), color var(--transition-base), background-color var(--transition-base), transform var(--transition-base);
}

.tech-chip__icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
  fill: currentcolor;
  opacity: 0.7;
  transition: fill var(--transition-base), opacity var(--transition-base);
}

.tech-chip__mono {
  display: grid;
  min-width: 0.95rem;
  height: 0.95rem;
  padding: 0 0.15rem;
  place-items: center;
  border-radius: 3px;
  background: var(--color-text-muted);
  color: var(--color-bg-primary);
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  transition: background-color var(--transition-base);
}

.tech-chip:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

.tech-chip:hover .tech-chip__icon {
  fill: var(--brand, currentcolor);
  opacity: 1;
}

.tech-chip:hover .tech-chip__mono {
  background: var(--color-accent);
}
</style>
