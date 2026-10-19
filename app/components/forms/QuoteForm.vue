<script setup lang="ts">
import type { QuoteFormData } from '~/types'
import { quoteFormSchema } from '~~/shared/utils/quoteSchema'

const { locale, t } = useI18n()
const config = useRuntimeConfig()
const emailClientDelivery = config.public.quoteDeliveryMode === 'email-client'
const formSubmitDelivery = config.public.quoteDeliveryMode === 'formsubmit'
const formElement = ref<HTMLFormElement | null>(null)
const routes = useSiteRoutes()
const { getFirstTouch, getLastTouch } = useUtm()
const { trackQuoteFormStarted, trackQuoteFormSubmitted, trackQuoteFormSuccess, trackQuoteFormError } = useAnalytics()

const form = reactive<QuoteFormData>({ name: '', company: '', email: '', phone: '', projectType: '', description: '', timeline: '', budget: '', howFound: '', privacyConsent: false, turnstileToken: '', website: '' })
const errors = ref<Record<string, string>>({})
const status = ref<'idle' | 'sending' | 'success' | 'error' | 'draft'>('idle')
const started = ref(false)
const draftEmailHref = ref('')
const ready = ref(false)
onMounted(() => { ready.value = true })
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
  if (status.value === 'sending') return
  errors.value = {}
  const result = emailClientDelivery || formSubmitDelivery
    ? quoteFormSchema.partial({ turnstileToken: true }).safeParse({ ...form, turnstileToken: undefined })
    : quoteFormSchema.safeParse(form)
  if (!result.success) {
    for (const issue of result.error.issues) errors.value[String(issue.path[0])] = issue.message
    trackQuoteFormError('validation', locale.value)
    return
  }

  if (formSubmitDelivery) {
    status.value = 'sending'
    formElement.value?.submit()
    return
  }

  if (emailClientDelivery) {
    const fields = ['name', 'company', 'email', 'phone', 'projectType', 'description', 'timeline', 'budget', 'howFound'] as const
    const body = fields.map(key => {
      const value = key === 'projectType'
        ? t(`quote.projectTypes.${form[key]}`)
        : key === 'budget' && form[key] ? t(`quote.budgetRanges.${form[key]}`) : form[key]
      return `${t(`quote.fields.${key}`)}: ${value || '-'}`
    }).join('\n\n')
    const subject = `WSS IT - ${t('quote.pageTitle')} - ${form.name}`
    draftEmailHref.value = `mailto:wssitconsultoria@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    status.value = 'draft'
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
  <div v-if="status === 'success'" class="form-state card" role="status"><h2>{{ $t('quote.success.title') }}</h2><p>{{ $t('quote.success.message') }}</p><AppButton :to="routes.home">{{ $t('quote.success.back') }}</AppButton></div>
  <form v-else ref="formElement" class="quote-form" :action="formSubmitDelivery ? 'https://formsubmit.co/wssitconsultoria@gmail.com' : undefined" method="post" novalidate @focusin="markStarted" @submit.prevent="submit">
    <template v-if="formSubmitDelivery">
      <input type="hidden" name="_subject" value="Novo orçamento - WSS IT">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_autoresponse" :value="$t('quote.success.message')">
    </template>
    <p v-if="emailClientDelivery" class="delivery-note">{{ $t('quote.emailClient.intro') }}</p>
    <div class="form-grid">
      <label><span>{{ $t('quote.fields.name') }} *</span><input v-model="form.name" name="name" autocomplete="name" :aria-invalid="!!errors.name"><small v-if="errors.name">{{ $t('quote.validation.nameRequired') }}</small></label>
      <label><span>{{ $t('quote.fields.company') }}</span><input v-model="form.company" name="company" autocomplete="organization"></label>
      <label><span>{{ $t('quote.fields.email') }} *</span><input v-model="form.email" name="email" type="email" autocomplete="email" :aria-invalid="!!errors.email"><small v-if="errors.email">{{ $t('quote.validation.emailInvalid') }}</small></label>
      <label><span>{{ $t('quote.fields.phone') }}</span><input v-model="form.phone" name="phone" type="tel" autocomplete="tel" placeholder="+55 41 99999-9999" :aria-invalid="!!errors.phone"><small v-if="errors.phone">{{ errors.phone }}</small></label>
      <label class="form-grid__wide"><span>{{ $t('quote.fields.projectType') }} *</span><select v-model="form.projectType" name="projectType" :aria-invalid="!!errors.projectType"><option value="">{{ $t('quote.selectPlaceholder') }}</option><option v-for="[value, label] in projectTypes" :key="value" :value="value">{{ label }}</option></select><small v-if="errors.projectType">{{ $t('quote.validation.projectTypeRequired') }}</small></label>
      <label class="form-grid__wide"><span>{{ $t('quote.fields.description') }} *</span><textarea v-model="form.description" name="description" rows="7" :placeholder="$t('quote.fields.descriptionPlaceholder')" :aria-invalid="!!errors.description" /><small v-if="errors.description">{{ $t('quote.validation.descriptionMinLength') }}</small></label>
      <label><span>{{ $t('quote.fields.timeline') }}</span><input v-model="form.timeline" name="timeline"></label>
      <label><span>{{ $t('quote.fields.budget') }}</span><select v-model="form.budget" name="budget"><option value="">{{ $t('quote.selectPlaceholder') }}</option><option v-for="[value, label] in budgets" :key="value" :value="value">{{ label }}</option></select></label>
      <label class="form-grid__wide"><span>{{ $t('quote.fields.howFound') }}</span><input v-model="form.howFound" name="howFound"></label>
      <label class="honeypot" aria-hidden="true" tabindex="-1"><span>Website</span><input v-model="form.website" name="_honey" tabindex="-1" autocomplete="off"></label>
    </div>
    <label class="consent"><input v-model="form.privacyConsent" name="privacyConsent" type="checkbox"><span>{{ $t('quote.fields.privacy') }} <NuxtLink :to="routes.privacy">{{ $t('quote.fields.privacyLink') }}</NuxtLink>.</span></label>
    <small v-if="errors.privacyConsent" class="field-error">{{ $t('quote.validation.privacyRequired') }}</small>
    <TurnstileWidget v-if="!emailClientDelivery && !formSubmitDelivery" @verify="form.turnstileToken = $event" @expired="form.turnstileToken = ''" />
    <p v-if="formSubmitDelivery" class="delivery-note">{{ $t('quote.formSubmitNotice') }}</p>
    <small v-if="errors.turnstileToken" class="field-error">{{ $t('quote.validation.turnstileRequired') }}</small>
    <div v-if="status === 'error'" class="form-error" role="alert"><strong>{{ $t('quote.error.title') }}</strong><p>{{ $t('quote.error.message') }}</p></div>
    <div v-if="status === 'draft'" class="delivery-note" role="status"><p>{{ $t('quote.emailClient.prepared') }}</p><a :href="draftEmailHref" class="btn btn-secondary">{{ $t('quote.emailClient.open') }}</a></div>
    <AppButton type="submit" size="large" :disabled="!ready || status === 'sending'">{{ status === 'sending' ? $t('quote.sending') : emailClientDelivery ? $t('quote.emailClient.button') : $t('quote.fields.submit') }}</AppButton>
  </form>
</template>

<style scoped>
.quote-form { padding: var(--space-10); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg-primary); box-shadow: var(--shadow-lg); }
.delivery-note { margin-bottom: var(--space-6); color: var(--color-text-secondary); font-size: var(--font-size-sm); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); }
.form-grid label { display: flex; flex-direction: column; gap: var(--space-2); color: var(--color-text-primary); font-size: var(--font-size-sm); font-weight: 500; }
.form-grid__wide { grid-column: 1 / -1; }
input, select, textarea { width: 100%; padding: .75rem .9rem; border: 1px solid var(--color-border-hover); border-radius: var(--radius-md); outline: none; background: var(--color-bg-primary); color: var(--color-text-primary); font-weight: 400; transition: border-color var(--transition-fast), box-shadow var(--transition-fast); }
input::placeholder, textarea::placeholder { color: #94A3B8; }
input:hover, select:hover, textarea:hover { border-color: #94A3B8; }
input:focus, select:focus, textarea:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(37, 99, 235, .15); }
textarea { resize: vertical; }
select { padding-right: 2.5rem; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%235B6B82' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E"); background-position: right .85rem center; background-repeat: no-repeat; cursor: pointer; }
[aria-invalid='true'] { border-color: var(--color-danger); }
small, .field-error { color: var(--color-danger); font-size: var(--font-size-xs); font-weight: 500; }
.consent { display: flex; align-items: flex-start; gap: var(--space-3); margin: var(--space-6) 0 var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-sm); }
.consent input { width: 1rem; height: 1rem; margin-top: .2rem; accent-color: var(--color-accent); }
.honeypot { position: absolute; left: -10000px; }
.form-error { margin: var(--space-5) 0; padding: var(--space-4); border: 1px solid #FECDCA; border-radius: var(--radius-md); background: var(--color-danger-soft); }
.form-error strong { color: var(--color-danger); }
.quote-form > .btn { width: 100%; margin-top: var(--space-6); }
.form-state { padding: var(--space-10); }
.form-state p { margin: var(--space-4) 0 var(--space-8); }
@media (max-width: 620px) { .quote-form { padding: var(--space-6) var(--space-5); } .form-grid { grid-template-columns: 1fr; } .form-grid__wide { grid-column: auto; } }
</style>
