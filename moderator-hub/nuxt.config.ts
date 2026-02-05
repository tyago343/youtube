import type { NuxtPage } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: {
    port: 8080,
  },
  runtimeConfig: {
    public: {
      apiUrl: "http://localhost:3012",
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
          page.meta ||= {};
          if (page.path === "/login") {
            page.meta.middleware = ["guest"];
          } else {
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
