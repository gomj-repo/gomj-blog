<template>
  <div class="flex items-center gap-2 px-4 py-3 select-none">
    <UIcon name="i-lucide-book-open" class="text-[var(--sidebar-text)] shrink-0" :style="{ width: '1.25rem', height: '1.25rem' }" />
    <span
      v-if="!collapsed"
      class="font-semibold text-sm truncate text-[var(--sidebar-text)]"
    >{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  collapsed?: boolean
}>()
</script>
