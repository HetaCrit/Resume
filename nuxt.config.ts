//nuxt.config.ts
import process from "node:process";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui-pro", "motion-v/nuxt"],
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  nitro: {
    preset: "deno",
    experimental: {
      wasm: true,
    },
  },
});
