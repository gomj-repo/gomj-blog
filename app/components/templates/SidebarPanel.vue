<template>
  <UDashboardSidebar collapsible resizable>
    <template #header="{ collapsed }">
      <SidebarLogo :title="title" :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <SidebarSearchInput
        v-model="searchQuery"
        :collapsed="collapsed"
        @search="handleSearch"
      />
      <SidebarNavTree :collapsed="collapsed" @navigate="handleNavigate" @add-node="handleAddNode" @rename-node="handleRenameNode" @delete-node="handleDeleteNode" />
      <ConfirmDialog
        v-model="showDeleteDialog"
        :title="`'${deleteTarget?.name}' 삭제`"
        :description="deleteTarget?.type === 'folder' ? '폴더와 모든 하위 항목이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.' : '페이지가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.'"
        @confirm="confirmDelete"
      />
      <TemplatePickerDialog
        v-model="showTemplatePicker"
        @select="confirmTemplateSelect"
      />
    </template>

    <template #footer="{ collapsed }">
      <div class="sidebar-panel-footer">
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="sidebar-panel-theme-toggle"
          @click="toggleColorMode"
        />
        <span
          v-if="!collapsed"
          class="sidebar-panel-theme-label"
        >{{ currentMode }}</span>
      </div>
      <SidebarUserProfile :collapsed="collapsed" @logout="handleLogout" />
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
import type { AddNodeType } from '~/components/mocules/SidebarSearchInput.vue'

defineProps<{
  title?: string
}>()

const router = useRouter()

const searchQuery = ref('')

const handleSearch = (query: string) => {
  if (query.trim()) {
    router.push({ path: '/search', query: { q: query.trim() } })
  }
}

const handleNavigate = (slug: string) => {
  router.push(`/${slug}`)
}

const folderApi = useFolderApi()
const pageApi = usePageApi()
const { folders } = useFolderStore()
const { allPages, setAllPages } = usePageStore()

const showTemplatePicker = ref(false)
const pendingPageParentId = ref<string | null>(null)

const handleAddNode = async (parentId: string | null, type: AddNodeType) => {
  if (type === 'folder') {
    await folderApi.createFolder({
      name: '새 폴더',
      slug: `new-folder-${Date.now()}`,
      parentId: parentId ?? null,
      sortOrder: folders.value.length
    })
  } else {
    pendingPageParentId.value = parentId
    showTemplatePicker.value = true
  }
}

const confirmTemplateSelect = async (template: { content: Record<string, unknown> | null }) => {
  const folderId = pendingPageParentId.value ?? folders.value[0]?.id ?? ''
  const page = await pageApi.createPage({
    folderId,
    parentPageId: null,
    title: '새 페이지',
    slug: `new-page-${Date.now()}`,
    content: template.content,
    isPublic: true,
    sortOrder: allPages.value.length
  })
  await pageApi.fetchAllPages()
  router.push('/' + page.slug)
}

const handleRenameNode = async (id: string, name: string) => {
  const folder = folders.value.find(f => f.id === id)
  if (folder) {
    await folderApi.updateFolder(id, { name })
    return
  }
  const page = allPages.value.find(p => p.id === id)
  if (page) {
    const updated = await pageApi.updatePage(id, { title: name })
    setAllPages(allPages.value.map(p => p.id === id ? updated : p))
  }
}

const deleteTarget = ref<{ id: string; type: 'folder' | 'page'; name: string } | null>(null)
const showDeleteDialog = ref(false)

const handleDeleteNode = (id: string, type: 'folder' | 'page') => {
  if (type === 'folder') {
    const folder = folders.value.find(f => f.id === id)
    if (!folder) return
    deleteTarget.value = { id, type, name: folder.name }
  } else {
    const page = allPages.value.find(p => p.id === id)
    if (!page) return
    deleteTarget.value = { id, type, name: page.title }
  }
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  const { id, type } = deleteTarget.value
  if (type === 'folder') {
    await folderApi.deleteFolder(id)
  } else {
    await pageApi.deletePage(id)
    await pageApi.fetchAllPages()
    const { currentPage } = usePageStore()
    if (currentPage.value?.id === id) {
      router.push('/')
    }
  }
  showDeleteDialog.value = false
  deleteTarget.value = null
}

const { isDark, currentMode, toggleColorMode } = useThemeStore()

const { setUser } = useAuthStore()
const handleLogout = async () => {
  await $fetch('/api/auth/sign-out', { method: 'POST' }).catch(() => {})
  setUser(null)
  router.push('/')
}
</script>

<style scoped src="~/assets/css/components/templates/SidebarPanel.css"></style>
