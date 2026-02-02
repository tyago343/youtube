const APP_NAME = "Moderator Hub";

export function usePageTitle() {
  const route = useRoute();

  const pageTitle = computed(() => {
    const meta = route.meta?.title;
    if (typeof meta === "string") return meta;
    if (route.path === "/" || route.name === "index") return "Dashboard";
    return "";
  });

  const documentTitle = computed(() =>
    pageTitle.value ? `${pageTitle.value} | ${APP_NAME}` : APP_NAME
  );

  useHead({
    title: documentTitle,
  });

  return { pageTitle };
}
