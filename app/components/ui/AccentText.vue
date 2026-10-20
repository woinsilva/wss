<script setup lang="ts">
/**
 * Renders a translated string where `*segments*` become accent words (<em>), without v-html.
 * Every word is wrapped (`.word > .word__inner`) so headings can be revealed word by word
 * (v-reveal-words / v-scrub-words). Example: "Parceiros de engenharia, *não só fornecedores*."
 */
const props = defineProps<{ text: string }>()
const parts = computed(() => splitAccent(props.text).map(part => ({
  accent: part.accent,
  // Keep the spaces as separate tokens so the text wraps and reads exactly like the source.
  tokens: part.text.split(/(\s+)/).filter(Boolean),
})))
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <component :is="part.accent ? 'em' : 'span'" class="accent-part">
      <template v-for="(token, tokenIndex) in part.tokens" :key="tokenIndex">
        <template v-if="/^\s+$/.test(token)">{{ ' ' }}</template>
        <span v-else class="word"><span class="word__inner">{{ token }}</span></span>
      </template>
    </component>
  </template>
</template>

<style scoped>
.word {
  display: inline-block;
  /* Room for descenders while the inner word slides up from below its mask. */
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
  overflow: hidden;
  vertical-align: top;
}

.word__inner {
  display: inline-block;
}
</style>
