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

      <input
        v-if="!collapsed && isEditing"
        ref="nameInputRef"
        v-model="editName"
        class="tree-node__name-input"
        @click.stop
        @keydown.enter="onEnter"
        @keydown.escape="cancelRename"
        @blur="confirmRename"
      />
      <span
        v-else-if="!collapsed"
        class="tree-node__name"
        @click.stop="handleNameClick"
      >{{ node.name }}</span>

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
        @rename="(id: string, name: string) => emit('rename', id, name)"
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
  rename: [id: string, name: string]
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

const isEditing = ref(false)
const editName = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)

const startRename = () => {
  editName.value = props.node.name
  isEditing.value = true
  nextTick(() => {
    nameInputRef.value?.focus()
    nameInputRef.value?.select()
  })
}

const onEnter = (e: KeyboardEvent) => {
  if (e.isComposing) return
  confirmRename()
}

const confirmRename = () => {
  if (!isEditing.value) return
  const trimmed = editName.value.trim()
  if (trimmed && trimmed !== props.node.name) {
    emit('rename', props.node.id, trimmed)
  }
  isEditing.value = false
}

const cancelRename = () => {
  isEditing.value = false
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const handleNameClick = () => {
  if (props.node.type === 'folder') {
    startRename()
  } else {
    emit('navigate', props.node.slug)
  }
}

const handleClick = () => {
  if (props.node.type === 'folder') {
    toggleOpen()
  }
}
</script>

<style scoped src="~/assets/css/components/molecules/SidebarTreeNode.css"></style>
