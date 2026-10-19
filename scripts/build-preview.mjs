import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const config = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'))
const result = spawnSync(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, ...config.vars },
})
if (result.status !== 0) process.exit(result.status || 1)
