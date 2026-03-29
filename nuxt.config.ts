export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/icon"],

  icon: {
    collections: ["lucide"],
  },

  devtools: { enabled: true }, // можно отключить в production: process.env.NODE_ENV === 'production' ? false : true

  // ⚠️ Если main.css содержит только Tailwind – удалите эту строку, так как @nuxt/ui сам подключает Tailwind.
  // Если там свои стили – оставьте, но убедитесь, что они не дублируются.
  css: ["~/assets/css/main.css"],

  ui: {
    primary: "green",
    neutral: "slate",
  },

  plugins: [
    "~/plugins/api.client", // API первым
    "~/plugins/auth.client", // Auth вторым (зависит от API)
  ],

  // 🚀 Улучшение производительности
  nitro: {
    compressPublicAssets: true, // gzip/brotli для статики (уменьшит CSS/JS в 3-5 раз)
    minify: true, // минификация кода на сервере
    sourceMap: false, // отключаем source map в production (уменьшает размер)
    routeRules: {
      "/**": { headers: { "Cache-Control": "max-age=31536000" } }, // кэширование статики на год
    },
  },

  vite: {
    optimizeDeps: {
      include: ["axios"],
    },
    build: {
      rollupOptions: {
        output: {
          // Ручное разделение бандлов для уменьшения времени загрузки
          manualChunks: {
            vendor: ["vue", "pinia", "axios"],
            ui: ["@nuxt/ui", "@nuxt/icon"],
          },
        },
      },
      // Уменьшаем размер чанков (по умолчанию 500kb, можно меньше)
      chunkSizeWarningLimit: 300,
    },
    // Отключаем source map для production
    ...(process.env.NODE_ENV === "production" && { sourcemap: false }),
  },

  // Глобальная конфигурация head (частично улучшает SEO)
  app: {
    head: {
      title: "Todo App – Управляйте задачами",
      meta: [
        {
          name: "description",
          content:
            "Простой и красивый менеджер задач. Планируйте, выполняйте, достигайте.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
      htmlAttrs: {
        lang: "ru", // для доступности и SEO
      },
    },
  },
});
