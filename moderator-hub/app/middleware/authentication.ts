import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  console.log("[Auth Middleware]", {
    to: to.path,
    from: from.path,
    user: userStore.user,
    hasToken: !!userStore.accessToken,
  });

  if (!userStore.user) {
    return navigateTo("/login");
  }
});
