<template>
  <div class="flex flex-col py-2">
    <!-- Home 고정 노드 -->
    <div
      class="group flex items-center cursor-pointer gap-1.5 rounded-md select-none transition-colors duration-150 mb-1"
      :class="[
        activeSlug === '' ? 'bg-neutral-800' : 'hover:bg-neutral-800',
        collapsed ? 'mx-1 px-0 py-1.5 justify-center' : 'mx-2 px-2 py-1.5'
      ]"
      @click="emit('navigate', '')"
    >
      <TreeNodeIcon type="home" />
      <span v-if="!collapsed" class="text-sm leading-5">Home</span>
      <UDropdownMenu v-if="!collapsed" :items="addRootItems">
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-plus"
          class="flex-shrink-0 opacity-0 ml-auto pointer-events-none cursor-pointer transition-opacity duration-150 group-hover:opacity-60 group-hover:pointer-events-auto"
          aria-label="Add new item"
          @click.stop
        />
      </UDropdownMenu>
    </div>

    <SidebarTreeNode
      v-for="node in tree"
      :key="node.id"
      :node="node"
      :depth="0"
      :collapsed="collapsed"
      :active-slug="activeSlug"
      @navigate="emit('navigate', $event)"
      @add-child="(parentId: string, type: AddNodeType) => emit('addNode', parentId, type)"
      @rename="(id: string, name: string) => emit('renameNode', id, name)"
      @delete-node="(id: string, type: 'folder' | 'page') => emit('deleteNode', id, type)"
    />
    <div
      v-if="tree.length === 0 && !collapsed"
      class="px-4 py-3 text-xs text-center opacity-40"
    >
      No pages yet
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { buildSidebarTree } from '~/composables/action/useSidebarTree'
import type { AddNodeType } from '~/components/SidebarSearchInput.vue'

defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  navigate: [slug: string]
  addNode: [parentId: string | null, type: AddNodeType]
  renameNode: [id: string, name: string]
  deleteNode: [id: string, type: 'folder' | 'page']
}>()

const { folders } = useFolderStore()
const { allPages, currentPage } = usePageStore()

const addRootItems: DropdownMenuItem[] = [
  {
    label: '페이지',
    icon: 'i-lucide-file-text',
    onSelect: () => emit('addNode', null, 'page')
  },
  { type: 'separator' },
  {
    label: '폴더',
    icon: 'i-lucide-folder',
    onSelect: () => emit('addNode', null, 'folder')
  }
]

const tree = computed(() => buildSidebarTree(folders.value, allPages.value))
const activeSlug = computed(() => currentPage.value?.slug ?? '')
</script>
