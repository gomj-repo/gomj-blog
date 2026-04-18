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
  <div class="editor-page">
    <div v-if="page" class="editor-page__container">
      <BreadcrumbNav :items="breadcrumbItems" />

      <input
        v-if="isEditingTitle"
        ref="titleInputRef"
        v-model="editTitle"
        class="editor-page__title-input"
        @keydown.enter="onTitleEnter"
        @keydown.escape="cancelTitle"
        @blur="confirmTitle"
      />
      <h1
        v-else
        class="editor-page__title"
        @click="startEditTitle"
      >{{ page.title }}</h1>

      <EditorContent :editor="editor" class="editor-content" />
    </div>

    <div v-else class="editor-page__not-found">
      <p>페이지를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<style scoped src="~/assets/css/pages/editor.css"></style>
