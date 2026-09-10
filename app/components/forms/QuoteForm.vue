<script setup lang="ts">
import type { QuoteFormData } from '~/types'
import { quoteFormSchema } from '~~/shared/utils/quoteSchema'

const { locale } = useI18n()
const routes = useSiteRoutes()
const { getFirstTouch, getLastTouch } = useUtm()
const { trackQuoteFormStarted, trackQuoteFormSubmitted, trackQuoteFormSuccess, trackQuoteFormError } = useAnalytics()

const form = reactive<QuoteFormData>({ name: '', company: '', email: '', phone: '', projectType: '', description: '', timeline: '', budget: '', howFound: '', privacyConsent: false, turnstileToken: '', website: '' })
const errors = ref<Record<string, string>>({})
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const started = ref(false)
const projectTypeContent = useTranslatedContent<Record<string, string>>('quote.projectTypes')
const budgetContent = useTranslatedContent<Record<string, string>>('quote.budgetRanges')
const projectTypes = computed(() => Object.entries(projectTypeContent.value))
const budgets = computed(() => Object.entries(budgetContent.value))

function markStarted() {
  if (started.value) return
  started.value = true
  trackQuoteFormStarted(locale.value)
}

async function submit() {
  errors.value = {}
  const result = quoteFormSchema.safeParse(form)
  if (!result.success) {
    for (const issue of result.error.issues) errors.value[String(issue.path[0])] = issue.message
    trackQuoteFormError('validation', locale.value)
    return
  }

  status.value = 'sending'
  trackQuoteFormSubmitted(result.data.projectType, locale.value)
  try {
    await $fetch('/api/quote', { method: 'POST', body: {
      ...result.data,
      locale: locale.value,
      landingPage: window.location.pathname,
      referrer: document.referrer || '',
      utmFirstTouch: getFirstTouch(),
      utmLastTouch: getLastTouch(),
      submittedAt: new Date().toISOString(),
    } })
    status.value = 'success'
    trackQuoteFormSuccess(result.data.projectType, locale.value)
  }
  catch {
    status.value = 'error'
    trackQuoteFormError('request', locale.value)
  }
}
</script>

<template>
  <div v-if="status === 'success'" class="form-state glass-card" role="status"><h2>{{ $t('quote.success.title') }}</h2><p>{{ $t('quote.success.message') }}</p><AppButton :to="routes.home">{{ $t('quote.success.back') }}</AppButton></div>
  <form v-else class="quote-form" novalidate @focusin="markStarted" @submit.prevent="submit">
    <div class="form-grid">
      <label><span>{{ $t('quote.form.name') }} *</span><input v-model="form.name" autocomplete="name" :aria-invalid="!!errors.name"><small v-if="errors.name">{{ $t('quote.validation.nameRequired') }}</small></label>
      <label><span>{{ $t('quote.form.company') }}</span><input v-model="form.company" autocomplete="organization"></label>
      <label><span>{{ $t('quote.form.email') }} *</span><input v-model="form.email" type="email" autocomplete="email" :aria-invalid="!!errors.email"><small v-if="errors.email">{{ $t('quote.validation.emailInvalid') }}</small></label>
      <label><span>{{ $t('quote.form.phone') }}</span><input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+55 41 99999-9999" :aria-invalid="!!errors.phone"><small v-if="errors.phone">{{ errors.phone }}</small></label>
      <label class="form-grid__wide"><span>{{ $t('quote.form.projectType') }} *</span><select v-model="form.projectType" :aria-invalid="!!errors.projectType"><option value="">{{ $t('quote.selectPlaceholder') }}</option><option v-for="[value, label] in projectTypes" :key="value" :value="value">{{ label }}</option></select><small v-if="errors.projectType">{{ $t('quote.validation.projectTypeRequired') }}</small></label>
      <label class="form-grid__wide"><span>{{ $t('quote.form.description') }} *</span><textarea v-model="form.description" rows="7" :placeholder="$t('quote.form.descriptionPlaceholder')" :aria-invalid="!!errors.description" /><small v-if="errors.description">{{ $t('quote.validation.descriptionMinLength') }}</small></label>
      <label><span>{{ $t('quote.form.timeline') }}</span><input v-model="form.timeline"></label>
      <label><span>{{ $t('quote.form.budget') }}</span><select v-model="form.budget"><option value="">{{ $t('quote.selectPlaceholder') }}</option><option v-for="[value, label] in budgets" :key="value" :value="value">{{ label }}</option></select></label>
      <label class="form-grid__wide"><span>{{ $t('quote.form.howFound') }}</span><input v-model="form.howFound"></label>
      <label class="honeypot" aria-hidden="true" tabindex="-1"><span>Website</span><input v-model="form.website" tabindex="-1" autocomplete="off"></label>
    </div>
    <label class="consent"><input v-model="form.privacyConsent" type="checkbox"><span>{{ $t('quote.form.privacy') }} <NuxtLink :to="routes.privacy">{{ $t('quote.form.privacyLink') }}</NuxtLink>.</span></label>
    <small v-if="errors.privacyConsent" class="field-error">{{ $t('quote.validation.privacyRequired') }}</small>
    <TurnstileWidget @verify="form.turnstileToken = $event" @expired="form.turnstileToken = ''" />
    <small v-if="errors.turnstileToken" class="field-error">{{ $t('quote.validation.turnstileRequired') }}</small>
    <div v-if="status === 'error'" class="form-error" role="alert"><strong>{{ $t('quote.error.title') }}</strong><p>{{ $t('quote.error.message') }}</p></div>
    <AppButton type="submit" size="large">{{ status === 'sending' ? $t('quote.sending') : $t('quote.form.submit') }}</AppButton>
  </form>
</template>

<style scoped>
.quote-form { max-width: 52rem; padding: var(--space-8); border: 1px solid var(--color-border); border-radius: var(--radius-2xl); background: var(--color-bg-surface); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); }
.form-grid label { display: flex; flex-direction: column; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-sm); font-weight: 600; }
.form-grid__wide { grid-column: 1 / -1; }
input, select, textarea { width: 100%; padding: .85rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); outline: none; background: var(--color-bg-primary); color: var(--color-text-primary); transition: border-color var(--transition-fast); }
input:focus, select:focus, textarea:focus { border-color: var(--color-accent-cyan); }
[aria-invalid='true'] { border-color: #fb7185; }
small, .field-error { color: #fda4af; }
.consent { display: flex; align-items: flex-start; gap: var(--space-3); margin: var(--space-6) 0; color: var(--color-text-secondary); }
.consent input { width: auto; margin-top: .35rem; }
.honeypot { position: absolute; left: -10000px; }
.form-error { margin: var(--space-5) 0; padding: var(--space-4); border: 1px solid rgba(251,113,133,.35); border-radius: var(--radius-md); }
.form-state { max-width: 52rem; padding: var(--space-10); }.form-state p { margin: var(--space-4) 0 var(--space-8); }
@media (max-width: 620px) { .quote-form { padding: var(--space-5); } .form-grid { grid-template-columns: 1fr; } .form-grid__wide { grid-column: auto; } }
</style>
