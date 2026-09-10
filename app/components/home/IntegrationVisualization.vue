<script setup lang="ts">
const active = ref('')
const { prefersReducedMotion } = useReducedMotion()
const nodes = ['CRM', 'ERP', 'AI', 'API', 'DB']
function x(node: string) { return node === 'CRM' || node === 'ERP' ? 92 : 508 }
function y(node: string) { return node === 'CRM' || node === 'AI' ? 105 : node === 'ERP' || node === 'DB' ? 410 : 260 }
</script>

<template>
  <div class="network glass-card" aria-label="WSS IT technology integration network">
    <svg viewBox="0 0 600 520" role="img">
      <defs>
        <linearGradient id="network-gradient"><stop stop-color="#00d1ff" /><stop offset=".5" stop-color="#2563eb" /><stop offset="1" stop-color="#7c3aed" /></linearGradient>
        <filter id="network-glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g class="network__lines">
        <path id="crm-line" d="M110 105 C205 105 215 240 300 260" :class="{ active: active === 'CRM' }" />
        <path id="erp-line" d="M110 410 C205 410 215 285 300 260" :class="{ active: active === 'ERP' }" />
        <path d="M300 260 C390 230 400 105 490 105" :class="{ active: active === 'AI' }" />
        <path id="api-line" d="M300 260 C390 260 400 260 490 260" :class="{ active: active === 'API' }" />
        <path d="M300 260 C390 290 400 410 490 410" :class="{ active: active === 'DB' }" />
      </g>
      <g v-if="!prefersReducedMotion" class="network__pulses" aria-hidden="true">
        <circle r="5"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#crm-line" /></animateMotion></circle>
        <circle r="5"><animateMotion dur="3.8s" begin=".8s" repeatCount="indefinite"><mpath href="#erp-line" /></animateMotion></circle>
        <circle r="5"><animateMotion dur="2.8s" begin=".4s" repeatCount="indefinite"><mpath href="#api-line" /></animateMotion></circle>
      </g>
      <g class="node node--core"><circle cx="300" cy="260" r="67" /><text x="300" y="254">WSS IT</text><text class="node__small" x="300" y="278">ENGINEERING</text></g>
      <g v-for="node in nodes" :key="node" class="node" tabindex="0" role="button" :aria-label="`${node} integration`" @mouseenter="active = node" @mouseleave="active = ''" @focus="active = node" @blur="active = ''">
        <circle :cx="x(node)" :cy="y(node)" r="43" /><text :x="x(node)" :y="y(node) + 5">{{ node }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.network { padding: var(--space-4); background: radial-gradient(circle at center, rgba(37,99,235,.12), rgba(15,23,42,.42)); }
.network svg { width: 100%; overflow: visible; }
.network__lines path { fill: none; stroke: rgba(148,163,184,.25); stroke-width: 2; transition: stroke var(--transition-base), stroke-width var(--transition-base); }
.network__lines path.active { stroke: url(#network-gradient); stroke-width: 5; filter: url(#network-glow); }
.network__pulses circle { fill: var(--color-accent-cyan); filter: url(#network-glow); }
.node circle { fill: var(--color-bg-elevated); stroke: rgba(148,163,184,.3); stroke-width: 2; transition: stroke var(--transition-base), filter var(--transition-base); }
.node:focus { outline: none; } .node:focus circle, .node:hover circle { stroke: var(--color-accent-cyan); filter: url(#network-glow); }
.node--core circle { fill: url(#network-gradient); stroke: rgba(255,255,255,.4); }
.node text { fill: var(--color-text-primary); font-size: 16px; font-weight: 700; text-anchor: middle; }
.node--core text { font-size: 22px; } .node .node__small { font-size: 8px; font-weight: 500; letter-spacing: .18em; }
@media (max-width: 900px) { .network { max-width: 36rem; margin: 0 auto; } }
</style>
