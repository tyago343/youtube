<template>
  <div class="flex h-screen flex-col">
    <header
      class="flex shrink-0 items-center border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
    >
      <slot name="header">
        <span class="text-lg font-semibold">Moderator Hub</span>
      </slot>
    </header>

    <div class="flex flex-1 min-h-0">
      <aside
        class="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50"
      >
        <slot name="sidebar">
          <nav class="flex flex-col gap-1 p-3"></nav>
        </slot>
      </aside>

      <main class="min-w-0 flex-1 overflow-auto bg-white p-4 dark:bg-gray-950">
        <slot />
      </main>
    </div>
  </div>
</template>
