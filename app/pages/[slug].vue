<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { allPages, setCurrentPage } = usePageStore()

const page = computed(() => allPages.value.find(p => p.slug === slug.value) ?? null)

watch(page, (p) => {
  setCurrentPage(p)
}, { immediate: true })

const editor = useEditor({
  content: page.value?.content ?? '<p>내용을 입력하세요...</p>',
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image,
    Link.configure({ openOnClick: false }),
  ],
})

// Update editor content when page changes
watch(page, (newPage) => {
  if (editor.value && newPage) {
    const currentContent = editor.value.getJSON()
    if (JSON.stringify(currentContent) !== JSON.stringify(newPage.content)) {
      editor.value.commands.setContent(newPage.content ?? '<p>내용을 입력하세요...</p>')
    }
  }
})
</script>

<template>
  <div class="editor-page">
    <div v-if="page" class="editor-page__container">
      <!-- Page title -->
      <h1 class="editor-page__title">{{ page.title }}</h1>

      <!-- Toolbar -->
      <div v-if="editor" class="editor-toolbar">
        <div class="editor-toolbar__group">
          <UButton
            variant="ghost" size="xs" icon="i-lucide-bold"
            :class="{ 'is-active': editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-italic"
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-underline"
            :class="{ 'is-active': editor.isActive('underline') }"
            @click="editor.chain().focus().toggleUnderline().run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-strikethrough"
            :class="{ 'is-active': editor.isActive('strike') }"
            @click="editor.chain().focus().toggleStrike().run()"
          />
        </div>

        <div class="editor-toolbar__separator" />

        <div class="editor-toolbar__group">
          <UButton
            variant="ghost" size="xs" icon="i-lucide-heading-1"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-heading-2"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-heading-3"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          />
        </div>

        <div class="editor-toolbar__separator" />

        <div class="editor-toolbar__group">
          <UButton
            variant="ghost" size="xs" icon="i-lucide-list"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-list-ordered"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            @click="editor.chain().focus().toggleOrderedList().run()"
          />
        </div>

        <div class="editor-toolbar__separator" />

        <div class="editor-toolbar__group">
          <UButton
            variant="ghost" size="xs" icon="i-lucide-align-left"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
            @click="editor.chain().focus().setTextAlign('left').run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-align-center"
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
            @click="editor.chain().focus().setTextAlign('center').run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-align-right"
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
            @click="editor.chain().focus().setTextAlign('right').run()"
          />
        </div>

        <div class="editor-toolbar__separator" />

        <div class="editor-toolbar__group">
          <UButton
            variant="ghost" size="xs" icon="i-lucide-code"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
            @click="editor.chain().focus().toggleCodeBlock().run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-quote"
            :class="{ 'is-active': editor.isActive('blockquote') }"
            @click="editor.chain().focus().toggleBlockquote().run()"
          />
          <UButton
            variant="ghost" size="xs" icon="i-lucide-minus"
            @click="editor.chain().focus().setHorizontalRule().run()"
          />
        </div>
      </div>

      <!-- Editor content -->
      <EditorContent :editor="editor" class="editor-content" />
    </div>

    <div v-else class="editor-page__not-found">
      <p>페이지를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<style scoped src="~/assets/css/pages/editor.css"></style>
