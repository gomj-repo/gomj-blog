<template>
  <div>
    <div
      class="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer select-none text-[var(--sidebar-text)] hover:bg-[var(--sidebar-item-hover)] transition-colors"
      :class="{ 'bg-[var(--sidebar-item-active)]': isActive }"
      :style="{ paddingLeft: `${depth * 0.75 + 0.5}rem` }"
      @click="handleClick"
    >
      <UButton
        v-if="node.children.length > 0"
        variant="ghost"
        color="neutral"
        size="xs"
        :icon="isOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        class="p-0 w-4 h-4 min-w-0 shrink-0 text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:bg-transparent"
        @click.stop="toggleOpen"
      />
      <span v-else class="w-4 shrink-0" />

      <TreeNodeIcon :type="node.type" :open="isOpen" />

      <span class="text-sm truncate flex-1">{{ node.name }}</span>
    </div>

    <div v-if="isOpen && node.children.length > 0">
      <SidebarTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :active-slug="activeSlug"
        @navigate="emit('navigate', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SidebarTreeNode as SidebarTreeNodeType } from '~/composables/action/useSidebarTree'

const props = defineProps<{
  node: SidebarTreeNodeType
  depth?: number
  activeSlug?: string
}>()

const emit = defineEmits<{
  navigate: [slug: string]
}>()

const depth = computed(() => props.depth ?? 0)
const isOpen = ref(false)
const isActive = computed(() => props.activeSlug === props.node.slug)

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
