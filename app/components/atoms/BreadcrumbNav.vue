<template>
  <UBreadcrumb :items="items" separator-icon="i-lucide-chevron-right" />
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>
