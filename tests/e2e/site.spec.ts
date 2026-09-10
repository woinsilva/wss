import { expect, test } from '@playwright/test'

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
