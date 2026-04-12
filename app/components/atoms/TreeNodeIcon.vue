<template>
  <UIcon
    :name="iconName"
    class="shrink-0 text-[var(--sidebar-text)] opacity-70"
    :style="{ width: '1rem', height: '1rem' }"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'folder' | 'page'
  open?: boolean
}>()

const iconName = computed(() => {
  if (props.type === 'folder') {
    return props.open ? 'i-lucide-folder-open' : 'i-lucide-folder'
  }
  return 'i-lucide-file-text'
})
</script>
