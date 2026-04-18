<template>
  <UDropdownMenu :items="menuItems">
    <UButton
      icon="i-lucide-download"
      variant="ghost"
      size="sm"
      aria-label="내보내기"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  pageId: string
  slug: string
}>()

const menuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: 'Markdown (.md)',
    icon: 'i-lucide-file-text',
    onSelect: () => downloadExport('md'),
  },
  {
    label: 'PDF (.pdf)',
    icon: 'i-lucide-file-down',
    onSelect: () => downloadExport('pdf'),
  },
])

function downloadExport(format: 'md' | 'pdf') {
  window.open(`/api/pages/${props.pageId}/export?format=${format}`, '_blank')
}
</script>
