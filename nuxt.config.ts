import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/icon"],

  plugins: ["~/plugins/api.client", "~/plugins/auth.client"],

  devtools: { enabled: true },
  devServer: {
    host: "localhost",
    port: 3000,
  },

  css: ["~/assets/css/main.css"],
  // @ts-expect-error: Nitro options
  nitro: {
    compressPublicAssets: true,
    minify: true,
    sourceMap: false,
    routeRules: {
      "/**": { headers: { "Cache-Control": "max-age=31536000" } },
    },
  },

  vite: {
    optimizeDeps: {
      include: ["axios"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue", "pinia", "axios"],
          },
        },
      },
      chunkSizeWarningLimit: 300,
    },
    ...(process.env.NODE_ENV === "production" && { sourcemap: false }),
  },

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
      htmlAttrs: { lang: "ru" },
    },
  },

  modulesConfig: {
    icon: {
      size: "24",
      aliases: {},
      scale: 1,
      defaultClass: "lucide",
      classPrefix: "i-",
      collections: ["lucide"],
    },
    ui: {
      primary: "green",
      neutral: "slate",
    },
  },
});
