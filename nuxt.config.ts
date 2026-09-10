import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    '/en/**': { prerender: true },
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

  // Runtime config
  runtimeConfig: {
    resendApiKey: '',
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
