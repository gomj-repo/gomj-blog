// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/sitemap',
  ],
  components: {
    pathPrefix: false,
  },
  site: {
    url: 'https://gomj.dev',
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  css: [
    '~/assets/css/variables.css',
    '~/assets/css/base.css',
    '~/assets/css/layout.css',
    '~/assets/css/components.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: 'GOMJ Portfolio',
      meta: [
        { name: 'description', content: 'GOMJ 개발 포트폴리오' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'GOMJ Portfolio' },
        { property: 'og:description', content: 'GOMJ 개발 포트폴리오 & 기술 블로그' },
        { property: 'og:site_name', content: 'GOMJ Portfolio' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'GOMJ Portfolio' },
        { name: 'twitter:description', content: 'GOMJ 개발 포트폴리오 & 기술 블로그' },
      ],
    },
  },
})
