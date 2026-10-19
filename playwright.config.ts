import { defineConfig, devices } from '@playwright/test'

const port = process.env.PLAYWRIGHT_PORT || '3101'
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'line',
  use: {
    baseURL,
    locale: 'pt-BR',
    trace: 'retain-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], locale: 'pt-BR' } }],
})
