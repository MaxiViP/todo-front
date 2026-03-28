export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxt/ui"],
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  ui: {
    colors: { primary: "green", neutral: "slate" },
  },

  vite: {
    optimizeDeps: {
      include: ["axios"],
    },
  },
});
