<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { buildBreadcrumb } from '~/composables/action/useBreadcrumb'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const pageApi = usePageApi()
const { allPages, setAllPages, setCurrentPage } = usePageStore()
const { folders } = useFolderStore()

const page = computed(() => allPages.value.find(p => p.slug === slug.value) ?? null)

const breadcrumbItems = computed(() => {
  if (!page.value) return []
  return buildBreadcrumb(folders.value, page.value.folderId, page.value.title)
})

watch(page, (p) => {
  setCurrentPage(p)
}, { immediate: true })

// Editable title with two-way sync
const isEditingTitle = ref(false)
const editTitle = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)

const startEditTitle = () => {
  if (!page.value) return
  editTitle.value = page.value.title
  isEditingTitle.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

const confirmTitle = async () => {
  if (!isEditingTitle.value || !page.value) return
  const trimmed = editTitle.value.trim()
  isEditingTitle.value = false
  if (trimmed && trimmed !== page.value.title) {
    const updated = await pageApi.updatePage(page.value.id, { title: trimmed })
    setAllPages(allPages.value.map(p => p.id === updated.id ? updated : p))
  }
}

const onTitleEnter = (e: KeyboardEvent) => {
  if (e.isComposing) return
  confirmTitle()
  editor.value?.commands.focus()
}

const cancelTitle = () => {
  isEditingTitle.value = false
}

// Auto-save with debounce - persists to server API
let saveTimer: ReturnType<typeof setTimeout> | null = null

const saveContent = async () => {
  if (!editor.value || !page.value) return
  const json = editor.value.getJSON()
  const text = editor.value.getText()
  const updated = await pageApi.updatePage(page.value.id, {
    content: json,
    plainText: text
  })
  setAllPages(allPages.value.map(p => p.id === updated.id ? updated : p))
}

const debouncedSave = () => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(saveContent, 500)
}

// Editor setup - markdown WYSIWYG (no toolbar)
const editor = useEditor({
  content: page.value?.content ?? '',
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
  ],
  onUpdate: debouncedSave,
})

// Sync editor content when navigating to a different page
watch(slug, () => {
  if (editor.value && page.value) {
    editor.value.commands.setContent(page.value.content ?? '')
  }
})

onUnmounted(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveContent()
  }
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <BreadcrumbNav :items="breadcrumbItems" />
        </template>
        <template #right>
          <PageExportMenu v-if="page" :page-id="page.id" :slug="page.slug" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="page" class="max-w-[50rem] mx-auto w-full">
        <input
          v-if="isEditingTitle"
          ref="titleInputRef"
          v-model="editTitle"
          class="text-[1.75rem] font-bold text-neutral-100 mb-4 pb-2 border-none border-b border-primary-400 bg-transparent outline-none w-full"
          @keydown.enter="onTitleEnter"
          @keydown.escape="cancelTitle"
          @blur="confirmTitle"
        />
        <h1
          v-else
          class="text-[1.75rem] font-bold text-neutral-100 mb-4 pb-2 border-b border-neutral-800 cursor-text"
          @click="startEditTitle"
        >{{ page.title }}</h1>

        <EditorContent :editor="editor" class="editor-content flex-1 overflow-y-auto py-2" />
      </div>

      <div v-else class="flex items-center justify-center h-full text-neutral-400 text-lg">
        <p>페이지를 찾을 수 없습니다.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<style scoped>
.editor-content :deep(.tiptap) {
  outline: none;
  min-height: 100%;
  color: var(--color-neutral-200, #e5e5e5);
  font-size: 1rem;
  line-height: 1.75;
}

.editor-content :deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--color-neutral-600, #525252);
  pointer-events: none;
  height: 0;
}

.editor-content :deep(.tiptap p) {
  margin: 0.5em 0;
}

.editor-content :deep(.tiptap h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 1em 0 0.5em;
}

.editor-content :deep(.tiptap h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.75em 0 0.5em;
}

.editor-content :deep(.tiptap h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.75em 0 0.5em;
}

.editor-content :deep(.tiptap ul),
.editor-content :deep(.tiptap ol) {
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.editor-content :deep(.tiptap ol) {
  color: var(--color-neutral-200, #e5e5e5);
}

.editor-content :deep(.tiptap li) {
  margin: 0.25em 0;
  color: var(--color-neutral-200, #e5e5e5);
}

.editor-content :deep(.tiptap li::marker) {
  color: var(--color-neutral-300, #d4d4d4);
}

.editor-content :deep(.tiptap blockquote) {
  border-left: 3px solid var(--color-neutral-700, #404040);
  padding-left: 1rem;
  margin: 0.5em 0;
  color: var(--color-neutral-400, #a3a3a3);
}

.editor-content :deep(.tiptap pre) {
  background-color: var(--color-neutral-900, #171717);
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 0.5em 0;
  overflow-x: auto;
  line-height: 1.4;
}

.editor-content :deep(.tiptap code) {
  background-color: var(--color-neutral-800, #262626);
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.875rem;
}

.editor-content :deep(.tiptap pre code) {
  background: none;
  padding: 0;
  line-height: 1.4;
}

.editor-content :deep(.tiptap hr) {
  border: none;
  border-top: 1px solid var(--color-neutral-800, #262626);
  margin: 1.5em 0;
}

.editor-content :deep(.tiptap a) {
  color: var(--color-primary-400, #60a5fa);
  text-decoration: underline;
  cursor: pointer;
}
</style>
