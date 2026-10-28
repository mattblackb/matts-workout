export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  css: ['~/assets/main.css'],
  app: {
    head: {
      title: 'Workout Tracker',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0f766e' },
        { name: 'description', content: 'Daily gym routines and set logging.' }
      ]
    }
  }
})
