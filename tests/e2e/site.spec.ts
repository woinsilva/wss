import { expect, test } from '@playwright/test'

const emailClientDelivery = process.env.NUXT_PUBLIC_QUOTE_DELIVERY_MODE === 'email-client'
const formSubmitDelivery = process.env.NUXT_PUBLIC_QUOTE_DELIVERY_MODE === 'formsubmit'

test('switches the homepage between Portuguese and English', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  await expect(page.locator('h1')).toBeVisible()
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/?$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
})

test('renders localized service routes', async ({ page }) => {
  await page.goto('/servicos/desenvolvimento-de-software')
  await expect(page.locator('h1')).toBeVisible()
  await page.goto('/en/services/custom-software-development')
  await expect(page.locator('h1')).toBeVisible()
})

test('redirects former industry pages to the general service catalog', async ({ page }) => {
  await page.goto('/solucoes')
  await expect(page).toHaveURL(/\/servicos\/?$/)
  await page.goto('/en/solutions/mortgage-technology')
  await expect(page).toHaveURL(/\/en\/services\/?$/)
})

test('opens and closes the keyboard-accessible mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const menuButton = page.getByRole('button', { name: /menu/i })
  await menuButton.click()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden()
})

test('shows localized error pages', async ({ page }) => {
  await page.goto('/nao-existe')
  await expect(page.locator('h1')).toContainText('Página não encontrada')
  await page.goto('/en/not-found')
  await expect(page.locator('h1')).toContainText('Page not found')
})

test('protects the quote endpoint before external delivery', async ({ request }) => {
  const invalid = await request.post('/api/quote', { data: {} })
  expect(invalid.status()).toBe(400)
  const honeypot = await request.post('/api/quote', { data: { website: 'spam.example' } })
  expect(honeypot.status()).toBe(200)
  const oversized = await request.post('/api/quote', { data: { website: '', padding: 'x'.repeat(52 * 1024) } })
  expect(oversized.status()).toBe(413)
})

test('renders translated quote fields and validates required values', async ({ page }) => {
  await page.goto('/orcamento')
  await expect(page.getByLabel('Nome', { exact: false })).toBeVisible()
  await expect(page.getByLabel('Descrição do projeto', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: emailClientDelivery ? 'Preparar e-mail de orçamento' : 'Enviar solicitação' }).click()
  await expect(page.getByText('Nome é obrigatório.')).toBeVisible()
  if (!emailClientDelivery && !formSubmitDelivery) await expect(page.getByText('Complete a verificação de segurança.')).toBeVisible()
  await page.goto('/en/quote')
  await expect(page.getByLabel('Name', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: emailClientDelivery ? 'Prepare quote email' : 'Submit request' })).toBeVisible()
})

test('hands validated requests to the email provider without exposing server secrets', async ({ page }) => {
  test.skip(!formSubmitDelivery, 'Only applies to the hosted form provider')
  let submitted: URLSearchParams | undefined
  await page.route('https://formsubmit.co/**', async (route) => {
    submitted = new URLSearchParams(route.request().postData() || '')
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Submission intercepted for testing</h1>' })
  })
  await page.goto('/orcamento')
  await expect(page.getByRole('button', { name: 'Enviar solicitação' })).toBeEnabled()
  await page.getByLabel('Nome *', { exact: true }).fill('Pessoa de Teste')
  await page.getByLabel('Email *', { exact: true }).fill('teste@example.com')
  await page.getByRole('combobox', { name: /Tipo de projeto/ }).selectOption('custom-software')
  await page.getByLabel('Descrição do projeto *', { exact: true }).fill('Precisamos de um sistema de atendimento para nossa empresa.')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Enviar solicitação' }).click()
  await expect(page.getByRole('heading', { name: 'Submission intercepted for testing' })).toBeVisible()
  expect(submitted?.get('name')).toBe('Pessoa de Teste')
  expect(submitted?.get('email')).toBe('teste@example.com')
  expect(submitted?.get('description')).toContain('sistema de atendimento')
  expect(submitted?.get('privacyConsent')).toBe('on')
  expect(submitted?.has('_captcha')).toBe(false)
  expect(submitted?.get('_honey')).toBe('')
})

test('prepares a localized quote email without claiming delivery', async ({ page }) => {
  test.skip(!emailClientDelivery, 'Only applies to previews using the email app')
  await page.goto('/orcamento')
  await expect(page.getByRole('button', { name: 'Preparar e-mail de orçamento' })).toBeEnabled()
  await page.getByLabel('Nome *', { exact: true }).fill('Pessoa de Teste')
  await page.getByLabel('Email *', { exact: true }).fill('teste@example.com')
  await page.getByRole('combobox', { name: /Tipo de projeto/ }).selectOption('custom-software')
  await page.getByLabel('Descrição do projeto *', { exact: true }).fill('Precisamos de um sistema de atendimento para nossa empresa.')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Preparar e-mail de orçamento' }).click()
  const draft = page.getByRole('link', { name: 'Abrir meu aplicativo de e-mail' })
  await expect(draft).toBeVisible()
  const href = await draft.getAttribute('href')
  expect(href).toMatch(/^mailto:wssitconsultoria@gmail.com\?/)
  expect(decodeURIComponent(href!)).toContain('Tipo de projeto: Sistema sob medida')
  expect(decodeURIComponent(href!)).toContain('Pessoa de Teste')
  await expect(page.getByRole('heading', { name: 'Recebemos sua solicitação.' })).toBeHidden()
})
