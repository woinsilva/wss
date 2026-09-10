import tailwindcss from '@tailwindcss/vite'
import { services } from './app/data/services'
import { solutions } from './app/data/solutions'

const serviceRoutes = services.flatMap(service => [
  `/servicos/${service.slugs['pt-BR']}`,
  `/en/services/${service.slugs.en}`,
])
const solutionRoutes = solutions.flatMap(solution => [
  `/solucoes/${solution.slugs['pt-BR']}`,
  `/en/solutions/${solution.slugs.en}`,
])

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: [{ path: '~/components', pathPrefix: false }],

  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      routes: [...serviceRoutes, ...solutionRoutes],
    },
  },

  // Prerender all public pages, keep API as serverless function
  routeRules: {
    '/': { prerender: true },
    '/servicos': { prerender: true },
    '/servicos/**': { prerender: true },
    '/solucoes': { prerender: true },
    '/solucoes/**': { prerender: true },
    '/sobre': { prerender: true },
    '/orcamento': { prerender: true },
    '/politica-de-privacidade': { prerender: true },
    '/termos': { prerender: true },
    '/en': { prerender: true },
    '/en/services': { prerender: true },
    '/en/services/**': { prerender: true },
    '/en/solutions': { prerender: true },
    '/en/solutions/**': { prerender: true },
    '/en/about': { prerender: true },
    '/en/quote': { prerender: true },
    '/en/privacy-policy': { prerender: true },
    '/en/terms': { prerender: true },
    '/api/**': { prerender: false },
  },

  // i18n configuration
  i18n: {
    locales: [
      {
        code: 'pt-BR',
        language: 'pt-BR',
        file: 'pt-BR.json',
        name: 'Português',
      },
      {
        code: 'en',
        language: 'en-US',
        file: 'en-US.json',
        name: 'English',
      },
    ],
    defaultLocale: 'pt-BR',
    strategy: 'prefix_except_default',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://wssit.com.br',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
    },
  },

  // Sitemap
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://wssit.com.br',
  },

  sitemap: {
    urls: [...serviceRoutes, ...solutionRoutes],
  },

  // Runtime config
  runtimeConfig: {
    resendApiKey: '',
    quoteFromEmail: 'WSS IT <contato@wssit.com.br>',
    quoteDestinationEmail: 'wssitconsultoria@gmail.com',
    turnstileSecretKey: '',
    public: {
      turnstileSiteKey: '',
      gaId: '',
      siteUrl: '',
    },
  },

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
      ],
    },
  },

  // CSS
  css: [
    '@fontsource-variable/inter/index.css',
    '~/assets/css/main.css',
  ],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
