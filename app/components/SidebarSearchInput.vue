<template>
  <div class="flex flex-col gap-1 px-3 py-2">
    <template v-if="!collapsed">
      <UInput
        :model-value="modelValue"
        placeholder="Search..."
        size="sm"
        :leading-icon="'i-lucide-search'"
        class="w-full"
        @update:model-value="emit('update:modelValue', $event)"
        @keydown.enter="emit('search', modelValue)"
      />

    </template>
    <UButton
      v-else
      variant="ghost"
      color="neutral"
      size="sm"
      icon="i-lucide-search"
      class="w-full justify-center"
      aria-label="Search"
      @click="emit('search', modelValue)"
    />
  </div>
</template>

<script setup lang="ts">
export type AddNodeType = 'page' | 'folder'

const props = defineProps<{
  modelValue: string
  collapsed?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string]
}>()

</script>
