<template>
  <div>
    <div
      class="group flex items-center cursor-pointer rounded-md select-none transition-colors duration-150 gap-1.5"
      :class="[
        isActive ? 'bg-neutral-800' : 'hover:bg-neutral-800',
        collapsed ? 'justify-center py-1.5 px-0 mx-1' : 'py-1 px-2 mx-2'
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
          class="flex-shrink-0 opacity-60 hover:opacity-100 hover:!bg-transparent"
          @click.stop="toggleOpen"
        />
        <span v-else class="w-5 flex-shrink-0" />
      </template>

      <TreeNodeIcon :type="node.type" :open="isOpen" />

      <input
        v-if="!collapsed && isEditing"
        ref="nameInputRef"
        v-model="editName"
        class="text-sm leading-5 text-inherit bg-transparent border border-neutral-600 rounded outline-none px-1 flex-1 min-w-0"
        @click.stop
        @keydown.enter="onEnter"
        @keydown.escape="cancelRename"
        @blur="confirmRename"
      />
      <span
        v-else-if="!collapsed"
        class="text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0"
        @click.stop="handleNameClick"
      >{{ node.name }}</span>

      <template v-if="!collapsed && node.type === 'folder'">
        <UDropdownMenu :items="addChildItems">
          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-plus"
            class="flex-shrink-0 opacity-0 ml-auto pointer-events-none cursor-pointer transition-opacity duration-150 group-hover:opacity-60 group-hover:pointer-events-auto"
            aria-label="Add child"
            @click.stop
          />
        </UDropdownMenu>
        <UDropdownMenu :items="folderMenuItems">
          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-ellipsis"
            class="flex-shrink-0 opacity-0 pointer-events-none cursor-pointer transition-opacity duration-150 group-hover:opacity-60 group-hover:pointer-events-auto"
            aria-label="Sort options"
            @click.stop
          />
        </UDropdownMenu>
      </template>
      <template v-else-if="!collapsed && node.type === 'page'">
        <UDropdownMenu :items="pageMenuItems">
          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-ellipsis"
            class="flex-shrink-0 opacity-0 ml-auto pointer-events-none cursor-pointer transition-opacity duration-150 group-hover:opacity-60 group-hover:pointer-events-auto"
            aria-label="Page options"
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
        @delete-node="(id: string, type: 'folder' | 'page') => emit('deleteNode', id, type)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { SidebarTreeNode as SidebarTreeNodeType } from '~/composables/action/useSidebarTree'
import type { AddNodeType } from '~/components/SidebarSearchInput.vue'

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
  deleteNode: [id: string, type: 'folder' | 'page']
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

const folderMenuItems = computed<DropdownMenuItem[]>(() => {
  const sortItems: DropdownMenuItem[] = [
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
  if (props.node.parentId === null) return sortItems
  return [
    ...sortItems,
    { type: 'separator' },
    {
      label: '삭제',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: () => emit('deleteNode', props.node.id, 'folder')
    }
  ]
})

const pageMenuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: '삭제',
    icon: 'i-lucide-trash-2',
    color: 'error',
    onSelect: () => emit('deleteNode', props.node.id, 'page')
  }
])

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
  startRename()
}

const handleClick = () => {
  if (props.node.type === 'folder') {
    toggleOpen()
  } else {
    emit('navigate', props.node.slug)
  }
}
</script>
