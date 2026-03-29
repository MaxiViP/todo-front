export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/icon"],

  icon: {
    collections: ['lucide']
  },

  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  ui: {
    primary: "green",
    neutral: "slate",
  },

  // Плагины — теперь оба важны
  plugins: [
    "~/plugins/auth.client", // сначала auth (init)
    "~/plugins/api.client", // потом api (зависит от authStore)
  ],

  vite: {
    optimizeDeps: {
      include: ["axios"],
    },
  },
});
