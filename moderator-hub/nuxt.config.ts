import type { NuxtPage } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  runtimeConfig: {
    public: {
      apiUrl: import.meta.env.NUXT_PUBLIC_API_URL || "http://localhost:3000",
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-auth-utils"],
  css: ["~/assets/css/main.css"],
  hooks: {
    // This activates the authentication middleware for all pages except the login page
    "pages:extend"(pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          if (page.path !== "/login") {
            page.meta ||= {};
            page.meta.middleware = ["authentication"];
          }
          if (page.children) {
            setMiddleware(page.children);
          }
        }
      }
      setMiddleware(pages);
    },
  },
});
