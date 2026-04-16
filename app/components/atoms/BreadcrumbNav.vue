<template>
  <nav class="breadcrumb-nav" aria-label="breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in items" :key="item.id" class="breadcrumb-item" :class="{ 'is-current': index === items.length - 1 }">
        <NuxtLink v-if="index < items.length - 1" :to="item.path" class="breadcrumb-link">
          {{ item.name }}
        </NuxtLink>
        <span v-else class="breadcrumb-current">{{ item.name }}</span>
        <span v-if="index < items.length - 1" class="breadcrumb-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/composables/action/useBreadcrumb'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style scoped>
.breadcrumb-nav {
  padding: 8px 0;
  font-size: 0.875rem;
}
.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4px;
  flex-wrap: wrap;
}
.breadcrumb-link {
  color: var(--color-text-secondary, #666);
  text-decoration: none;
}
.breadcrumb-link:hover {
  color: var(--color-text-primary, #333);
  text-decoration: underline;
}
.breadcrumb-current {
  color: var(--color-text-primary, #333);
  font-weight: 500;
}
.breadcrumb-separator {
  color: var(--color-text-tertiary, #999);
  margin: 0 2px;
}
</style>
