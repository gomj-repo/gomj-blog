<template>
  <div class="sidebar-nav-tree">
    <!-- Home 고정 노드 -->
    <div
      class="tree-node tree-node--home"
      :class="[
        { 'is-active': activeSlug === '' },
        { 'is-collapsed': collapsed }
      ]"
      @click="emit('navigate', '')"
    >
      <TreeNodeIcon type="home" />
      <span v-if="!collapsed" class="tree-node__name">Home</span>
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
    />
    <div
      v-if="tree.length === 0 && !collapsed"
      class="sidebar-nav-tree__empty"
    >
      No pages yet
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildSidebarTree } from '~/composables/action/useSidebarTree'
import type { AddNodeType } from '~/components/mocules/SidebarSearchInput.vue'

defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  navigate: [slug: string]
  addNode: [parentId: string | null, type: AddNodeType]
}>()

const { folders } = useFolderStore()
const { allPages, currentPage } = usePageStore()

const tree = computed(() => buildSidebarTree(folders.value, allPages.value))
const activeSlug = computed(() => currentPage.value?.slug ?? '')
</script>

<style scoped src="~/assets/css/components/templates/SidebarNavTree.css"></style>
