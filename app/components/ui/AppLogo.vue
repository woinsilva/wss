<template>
  <span class="brand" aria-label="WSS IT">
    <span class="brand__mark" aria-hidden="true">W</span>
    <span class="brand__name">WSS<span>IT</span></span>
  </span>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--color-text-primary);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.brand__mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 0.6rem;
  background: var(--gradient-brand);
  color: white;
  font-size: 1.05rem;
  box-shadow: var(--shadow-glow-cyan);
}

.brand__name {
  font-size: 1.15rem;
}

.brand__name span {
  margin-left: 0.18rem;
  color: var(--color-accent-cyan);
}
</style>
