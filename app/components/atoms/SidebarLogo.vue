<template>
  <div class="sidebar-logo" :class="{ 'is-collapsed': collapsed }">
    <UIcon name="i-lucide-book-open" class="sidebar-logo__icon" :style="{ width: '1.25rem', height: '1.25rem' }" />
    <span
      v-if="!collapsed"
      class="sidebar-logo__title"
    >{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  collapsed?: boolean
}>()
</script>

<style scoped src="~/assets/css/components/molecules/SidebarLogo.css"></style>
