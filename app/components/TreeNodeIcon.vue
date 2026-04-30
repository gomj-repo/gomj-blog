<template>
  <UIcon
    :name="iconName"
    class="shrink-0 size-4 opacity-70"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'folder' | 'page' | 'home'
  open?: boolean
}>()

const iconName = computed(() => {
  if (props.type === 'home') {
    return 'i-lucide-house'
  }
  if (props.type === 'folder') {
    return props.open ? 'i-lucide-folder-open' : 'i-lucide-folder'
  }
  return 'i-lucide-file-text'
})
</script>
