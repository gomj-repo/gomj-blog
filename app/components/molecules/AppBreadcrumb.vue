<script setup lang="ts">
import { useBoardMeta } from '~/composables/useBoardMeta'

const route = useRoute()

const segments = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  return parts.map((part, index) => ({
    label: part,
    path: '/' + parts.slice(0, index + 1).join('/'),
    isLast: index === parts.length - 1,
  }))
})

const { boardLabel } = useBoardMeta()

function formatLabel(segment: { label: string; path: string }, index: number) {
  if (index === 0) return boardLabel.value
  return segment.label
    .replace(/^\d+\./, '')
    .replace(/-/g, ' ')
}
</script>

<template>
  <nav v-if="segments.length" class="breadcrumb">
    <NuxtLink to="/" class="breadcrumb__item">Home</NuxtLink>
    <template v-for="(segment, index) in segments" :key="segment.path">
      <span class="breadcrumb__separator">/</span>
      <span v-if="segment.isLast" class="breadcrumb__current">{{ formatLabel(segment, index) }}</span>
      <NuxtLink v-else :to="segment.path" class="breadcrumb__item">
        {{ formatLabel(segment, index) }}
      </NuxtLink>
    </template>
  </nav>
</template>
