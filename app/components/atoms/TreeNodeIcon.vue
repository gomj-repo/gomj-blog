<template>
  <UIcon
    :name="iconName"
    class="tree-node-icon"
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

<style scoped src="~/assets/css/components/molecules/TreeNodeIcon.css"></style>
