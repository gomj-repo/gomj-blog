<template>
  <UBreadcrumb :items="visibleItems" separator-icon="i-lucide-chevron-right" />
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { collapseBreadcrumb } from '~/composables/action/useBreadcrumb'

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const isMobile = ref(false)

onMounted(() => {
  const mql = window.matchMedia('(max-width: 640px)')
  isMobile.value = mql.matches
  const handler = (e: MediaQueryListEvent) => { isMobile.value = e.matches }
  mql.addEventListener('change', handler)
  onUnmounted(() => mql.removeEventListener('change', handler))
})

const visibleItems = computed(() =>
  isMobile.value ? collapseBreadcrumb(props.items, 3) : props.items
)
</script>
