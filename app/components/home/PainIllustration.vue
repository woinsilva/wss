<script setup lang="ts">
/**
 * Brand illustrations for the pain cards (decorative, aria-hidden). One scene per pain, in order:
 * 0 disconnected systems, 1 silent integration failure, 2 untouchable legacy system,
 * 3 recurring production bug, 4 vendor nobody can assess.
 */
defineProps<{ variant: number }>()
</script>

<template>
  <svg class="pain-art" viewBox="0 0 480 280" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="pain-art-accent" x1="40" y1="40" x2="440" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#8DB0FF" />
        <stop offset="1" stop-color="#A78BFA" />
      </linearGradient>
      <radialGradient id="pain-art-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#2563EB" stop-opacity="0.45" />
        <stop offset="1" stop-color="#2563EB" stop-opacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="240" cy="150" rx="210" ry="120" fill="url(#pain-art-glow)" />

    <!-- 0: two systems, the link between them broken; a person copies data by hand -->
    <g v-if="variant === 0">
      <rect x="40" y="70" width="140" height="110" rx="12" class="pain-art__panel" />
      <rect x="300" y="70" width="140" height="110" rx="12" class="pain-art__panel" />
      <g class="pain-art__lines">
        <line x1="60" y1="100" x2="150" y2="100" /><line x1="60" y1="122" x2="130" y2="122" /><line x1="60" y1="144" x2="160" y2="144" />
        <line x1="320" y1="100" x2="410" y2="100" /><line x1="320" y1="122" x2="390" y2="122" /><line x1="320" y1="144" x2="420" y2="144" />
      </g>
      <path d="M180 125 H222" class="pain-art__wire" />
      <path d="M258 125 H300" class="pain-art__wire" />
      <path d="M226 112 l14 26 M240 112 l14 26" class="pain-art__alert" />
      <rect x="176" y="200" width="128" height="40" rx="8" class="pain-art__chip pain-art__float" />
      <text x="240" y="225" class="pain-art__label pain-art__float">copy · paste</text>
    </g>

    <!-- 1: data flowing through a pipeline with a gap; a muted alert nobody sees -->
    <g v-else-if="variant === 1">
      <path d="M40 140 H190" class="pain-art__wire" />
      <path d="M290 140 H440" class="pain-art__wire pain-art__wire--dim" />
      <circle r="7" class="pain-art__packet"><animateMotion dur="2.4s" repeatCount="indefinite" path="M40 140 H190" /></circle>
      <circle cx="240" cy="140" r="44" class="pain-art__panel" />
      <path d="M222 122 l36 36 M258 122 l-36 36" class="pain-art__alert" />
      <rect x="320" y="56" width="110" height="44" rx="10" class="pain-art__chip" />
      <path d="M338 70 l10 16 h-20 z" class="pain-art__bell" />
      <line x1="360" y1="72" x2="412" y2="72" class="pain-art__muted" /><line x1="360" y1="84" x2="398" y2="84" class="pain-art__muted" />
      <path d="M326 62 L424 94" class="pain-art__strike" />
    </g>

    <!-- 2: an old terminal wrapped in warning tape -->
    <g v-else-if="variant === 2">
      <rect x="140" y="50" width="200" height="140" rx="14" class="pain-art__panel" />
      <rect x="160" y="70" width="160" height="96" rx="6" class="pain-art__screen" />
      <text x="174" y="100" class="pain-art__code">C:\&gt; LEGACY.EXE</text>
      <text x="174" y="122" class="pain-art__code pain-art__blink">_</text>
      <rect x="200" y="190" width="80" height="20" rx="4" class="pain-art__panel" />
      <rect x="170" y="210" width="140" height="12" rx="6" class="pain-art__panel" />
      <g class="pain-art__tape" transform="rotate(-12 240 120)">
        <rect x="80" y="112" width="320" height="26" />
        <text x="240" y="130" class="pain-art__tape-text">DO NOT TOUCH · DO NOT TOUCH</text>
      </g>
    </g>

    <!-- 3: a bug stuck in a loop around production -->
    <g v-else-if="variant === 3">
      <circle cx="240" cy="140" r="86" class="pain-art__orbit" />
      <rect x="196" y="116" width="88" height="48" rx="10" class="pain-art__chip" />
      <text x="240" y="145" class="pain-art__label">prod</text>
      <g class="pain-art__spin">
        <g transform="translate(240 54)">
          <ellipse rx="13" ry="17" class="pain-art__bug" />
          <path d="M-13 -6 h-10 M-13 4 h-10 M13 -6 h10 M13 4 h10 M-5 -16 l-6 -8 M5 -16 l6 -8" class="pain-art__bug-legs" />
        </g>
      </g>
      <path d="M316 92 a86 86 0 0 1 8 30 l10 -12 M324 122 l-12 -8" class="pain-art__arrow" />
    </g>

    <!-- 4: a sealed box from a vendor and a question mark nobody can answer -->
    <g v-else>
      <path d="M170 110 L240 76 L310 110 L240 144 Z" class="pain-art__panel" />
      <path d="M170 110 V190 L240 224 V144 Z" class="pain-art__panel" />
      <path d="M310 110 V190 L240 224 V144 Z" class="pain-art__screen" />
      <path d="M205 93 L275 127" class="pain-art__muted" />
      <text x="360" y="110" class="pain-art__question pain-art__float">?</text>
      <text x="110" y="150" class="pain-art__question pain-art__question--small pain-art__float pain-art__float--late">?</text>
    </g>
  </svg>
</template>

<style scoped>
.pain-art {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.pain-art__panel {
  fill: #121A30;
  stroke: rgba(141, 176, 255, 0.45);
  stroke-width: 1.5;
}

.pain-art__screen {
  fill: #0A1022;
  stroke: rgba(141, 176, 255, 0.3);
}

.pain-art__chip {
  fill: rgba(37, 99, 235, 0.18);
  stroke: url(#pain-art-accent);
  stroke-width: 1.5;
}

.pain-art__lines line,
.pain-art__muted {
  stroke: rgba(195, 202, 217, 0.35);
  stroke-width: 6;
  stroke-linecap: round;
}

.pain-art__wire {
  fill: none;
  stroke: url(#pain-art-accent);
  stroke-width: 3;
  stroke-dasharray: 8 8;
  animation: pain-dash 1.2s linear infinite;
}

.pain-art__wire--dim {
  opacity: 0.25;
  animation: none;
}

.pain-art__alert,
.pain-art__strike {
  fill: none;
  stroke: #FF8A80;
  stroke-width: 4;
  stroke-linecap: round;
}

.pain-art__strike {
  stroke-width: 2.5;
  opacity: 0.8;
}

.pain-art__packet {
  fill: #8DB0FF;
}

.pain-art__bell {
  fill: rgba(195, 202, 217, 0.45);
}

.pain-art__label,
.pain-art__code,
.pain-art__tape-text {
  font-family: var(--font-mono);
  font-size: 14px;
  text-anchor: middle;
  fill: #C3CAD9;
}

.pain-art__code {
  fill: #8DB0FF;
  text-anchor: start;
}

.pain-art__tape rect {
  fill: #FACC15;
  opacity: 0.9;
}

.pain-art__tape-text {
  font-size: 12px;
  font-weight: 700;
  fill: #1A1A1A;
  letter-spacing: 0.08em;
}

.pain-art__orbit {
  fill: none;
  stroke: rgba(141, 176, 255, 0.3);
  stroke-width: 2;
  stroke-dasharray: 4 10;
}

.pain-art__bug {
  fill: #FF8A80;
}

.pain-art__bug-legs {
  stroke: #FF8A80;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.pain-art__arrow {
  fill: none;
  stroke: url(#pain-art-accent);
  stroke-width: 2.5;
  stroke-linecap: round;
}

.pain-art__question {
  font-family: var(--font-heading);
  font-size: 96px;
  font-weight: 800;
  text-anchor: middle;
  fill: url(#pain-art-accent);
}

.pain-art__question--small {
  font-size: 56px;
  opacity: 0.6;
}

.pain-art__spin {
  animation: pain-spin 6s linear infinite;
  transform-origin: 240px 140px;
}

.pain-art__float {
  animation: pain-float 3.2s ease-in-out infinite;
}

.pain-art__float--late {
  animation-delay: -1.6s;
}

.pain-art__blink {
  animation: pain-blink 1.1s steps(1) infinite;
}

@keyframes pain-dash {
  to { stroke-dashoffset: -32; }
}

@keyframes pain-spin {
  to { transform: rotate(360deg); }
}

@keyframes pain-float {
  50% { transform: translateY(-8px); }
}

@keyframes pain-blink {
  50% { opacity: 0; }
}

/* Soft motion level: keep the scenes, slow and calm (no spinning). */
@media (prefers-reduced-motion: reduce) {
  .pain-art__spin {
    animation: none;
  }

  .pain-art__wire,
  .pain-art__float {
    animation-duration: 6s;
  }
}
</style>
