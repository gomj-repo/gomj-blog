<template>
  <UButton
    variant="ghost"
    color="neutral"
    size="sm"
    :icon="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
  
    :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    @click="emit('toggle')"
  />
</template>

<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>
