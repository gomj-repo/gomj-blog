<template>
  <div class="px-3 py-2">
    <UInput
      v-if="!collapsed"
      :model-value="modelValue"
      placeholder="Search..."
      size="sm"
      :leading-icon="'i-lucide-search'"
      class="w-full"
      :ui="{ base: 'bg-[var(--sidebar-item-hover)] border-[var(--sidebar-border)] text-[var(--sidebar-text)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40' }"
      @update:model-value="emit('update:modelValue', $event)"
      @keydown.enter="emit('search', modelValue)"
    />
    <UButton
      v-else
      variant="ghost"
      color="neutral"
      size="sm"
      icon="i-lucide-search"
      class="w-full justify-center text-[var(--sidebar-text)] hover:bg-[var(--sidebar-item-hover)]"
      aria-label="Search"
      @click="emit('search', modelValue)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  collapsed?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string]
}>()
</script>
