import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  imports: {
    dirs: [
      'composables/action',
      'composables/sideeffect',
      'composables/store'
    ]
  },

  css: ['~/assets/css/base/main.css'],

  devtools: { enabled: false },

  compatibilityDate: '2025-01-15',

  alias: {
    '#shared': '../shared'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'GOMJ Wiki'
    }
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    }
  },

  nitro: {
    publicAssets: [
      { dir: 'uploads', maxAge: 60 * 60 * 24 * 30 }
    ],
    alias: {
      '#shared': new URL('./shared', import.meta.url).pathname
    }
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    betterAuthSecret: process.env.BETTER_AUTH_SECRET ?? '',
    betterAuthUrl: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    useDatabaseMode: process.env.USE_DATABASE_MODE ?? 'POSTGRES'
  }
})
