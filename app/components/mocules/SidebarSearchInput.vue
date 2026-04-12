<template>
  <div class="sidebar-search">
    <template v-if="!collapsed">
      <UInput
        :model-value="modelValue"
        placeholder="Search..."
        size="sm"
        :leading-icon="'i-lucide-search'"
        class="sidebar-search__field"
        :ui="{ base: 'sidebar-search__input' }"
        @update:model-value="emit('update:modelValue', $event)"
        @keydown.enter="emit('search', modelValue)"
      />

      <!-- '+' 드롭다운: 페이지/폴더 생성 -->
      <UDropdownMenu :items="addItems">
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-plus"
          class="sidebar-search__action-button"
          aria-label="Add new item"
        />
      </UDropdownMenu>

    </template>
    <UButton
      v-else
      variant="ghost"
      color="neutral"
      size="sm"
      icon="i-lucide-search"
      class="w-full justify-center sidebar-search__icon-button"
      aria-label="Search"
      @click="emit('search', modelValue)"
    />
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

export type AddNodeType = 'page' | 'folder'

const props = defineProps<{
  modelValue: string
  collapsed?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string]
  'addRoot': [type: AddNodeType]
}>()

const addItems: DropdownMenuItem[] = [
  {
    label: '페이지',
    icon: 'i-lucide-file-text',
    onSelect: () => emit('addRoot', 'page')
  },
  { type: 'separator' },
  {
    label: '폴더',
    icon: 'i-lucide-folder',
    onSelect: () => emit('addRoot', 'folder')
  }
]

</script>

<style scoped src="~/assets/css/components/molecules/SidebarSearchInput.css"></style>
