<script setup lang="ts">
const colorMode = useColorMode();
const { pageTitle } = usePageTitle();
const { clear } = useUserSession();
const themeMenuItems = [
  {
    label: "System",
    icon: "i-ph-monitor",
    onSelect: () => {
      colorMode.preference = "system";
    },
  },
  {
    label: "Light",
    icon: "i-ph-sun",
    onSelect: () => {
      colorMode.preference = "light";
    },
  },
  {
    label: "Dark",
    icon: "i-ph-moon",
    onSelect: () => {
      colorMode.preference = "dark";
    },
  },
  {
    label: "Logout",
    icon: "i-ph-sign-out",
    onSelect: () => {
      clear();
      navigateTo("/login");
    },
  },
];
</script>

<template>
  <div class="flex h-screen flex-col">
    <header
      class="grid grid-cols-3 shrink-0 items-center border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center">
        <slot name="header">
          <span class="text-lg font-semibold">Moderator Hub</span>
        </slot>
      </div>

      <div class="flex justify-center">
        <slot name="title">
          <h1
            v-if="pageTitle"
            class="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            {{ pageTitle }}
          </h1>
        </slot>
      </div>

      <div class="flex items-center justify-end gap-1">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-ph-bell"
          aria-label="Notifications"
          class="cursor-pointer"
        />
        <UDropdownMenu :items="themeMenuItems">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-ph-gear"
            aria-label="Settings and theme"
            class="cursor-pointer"
          />
        </UDropdownMenu>
      </div>
    </header>

    <div class="flex flex-1 min-h-0">
      <aside
        class="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50"
      >
        <slot name="sidebar">
          <nav class="flex flex-col gap-1 p-3">
            <NuxtLink
              to="/"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              active-class="bg-primary/10 text-primary dark:bg-primary/20"
            >
              Informes
            </NuxtLink>
          </nav>
        </slot>
      </aside>

      <main class="min-w-0 flex-1 overflow-auto bg-white p-4 dark:bg-gray-950">
        <slot />
      </main>
    </div>
  </div>
</template>
