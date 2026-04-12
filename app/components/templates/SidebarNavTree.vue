<template>
  <div class="flex-1 overflow-y-auto py-2">
    <SidebarTreeNode
      v-for="node in tree"
      :key="node.id"
      :node="node"
      :depth="0"
      :active-slug="activeSlug"
      @navigate="emit('navigate', $event)"
    />
    <div
      v-if="tree.length === 0"
      class="px-4 py-3 text-xs text-[var(--sidebar-text)] opacity-40 select-none"
    >
      No pages yet
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildSidebarTree } from '~/composables/action/useSidebarTree'

defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  navigate: [slug: string]
}>()

const { folders } = useFolderStore()
const { allPages, currentPage } = usePageStore()

const tree = computed(() => buildSidebarTree(folders.value, allPages.value))
const activeSlug = computed(() => currentPage.value?.slug ?? '')
</script>
