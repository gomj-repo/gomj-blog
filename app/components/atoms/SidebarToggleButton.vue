<template>
  <UButton
    variant="ghost"
    color="neutral"
    size="sm"
    :icon="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
    class="sidebar-toggle"
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

<style scoped src="~/assets/css/components/molecules/SidebarToggleButton.css"></style>
