<template>
  <div>
    <div
      class="tree-node"
      :class="[
        { 'is-active': isActive },
        { 'is-collapsed': collapsed }
      ]"
      :style="collapsed ? {} : { paddingLeft: `${depth * 0.75 + 0.5}rem` }"
      @click="handleClick"
    >
      <template v-if="!collapsed">
        <UButton
          v-if="node.children.length > 0"
          variant="ghost"
          color="neutral"
          size="xs"
          :icon="isOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="tree-node__toggle"
          @click.stop="toggleOpen"
        />
        <span v-else class="tree-node__spacer" />
      </template>

      <TreeNodeIcon :type="node.type" :open="isOpen" />

      <span v-if="!collapsed" class="tree-node__name">{{ node.name }}</span>

      <template v-if="!collapsed && node.type === 'folder'">
        <UDropdownMenu :items="addChildItems">
          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-plus"
            class="tree-node__action-button"
            aria-label="Add child"
            @click.stop
          />
        </UDropdownMenu>
        <UDropdownMenu :items="sortChildItems">
          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-ellipsis"
            class="tree-node__action-button"
            aria-label="Sort options"
            @click.stop
          />
        </UDropdownMenu>
      </template>
    </div>

    <div v-if="isOpen && node.children.length > 0 && !collapsed">
      <SidebarTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :collapsed="collapsed"
        :active-slug="activeSlug"
        @navigate="emit('navigate', $event)"
        @add-child="(parentId: string, type: AddNodeType) => emit('addChild', parentId, type)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { SidebarTreeNode as SidebarTreeNodeType } from '~/composables/action/useSidebarTree'
import type { AddNodeType } from '~/components/mocules/SidebarSearchInput.vue'

const props = defineProps<{
  node: SidebarTreeNodeType
  depth?: number
  collapsed?: boolean
  activeSlug?: string
}>()

const emit = defineEmits<{
  navigate: [slug: string]
  addChild: [parentId: string, type: AddNodeType]
}>()

const depth = computed(() => props.depth ?? 0)
const isOpen = ref(false)
const isActive = computed(() => props.activeSlug === props.node.slug)

const addChildItems: DropdownMenuItem[] = [
  {
    label: '페이지',
    icon: 'i-lucide-file-text',
    onSelect: () => emit('addChild', props.node.id, 'page')
  },
  { type: 'separator' },
  {
    label: '폴더',
    icon: 'i-lucide-folder',
    onSelect: () => emit('addChild', props.node.id, 'folder')
  }
]

const sortChildItems: DropdownMenuItem[] = [
  { type: 'label', label: '정렬' },
  {
    label: '트리 순서',
    icon: 'i-lucide-list-tree'
  },
  {
    label: '최근 수정',
    icon: 'i-lucide-clock'
  },
  {
    label: '제목 오름차순',
    icon: 'i-lucide-arrow-up-a-z'
  }
]

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const handleClick = () => {
  if (props.node.type === 'page') {
    emit('navigate', props.node.slug)
  } else {
    toggleOpen()
  }
}
</script>

<style scoped src="~/assets/css/components/molecules/SidebarTreeNode.css"></style>
