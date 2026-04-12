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
      <SidebarNavTree :collapsed="collapsed" @navigate="handleNavigate" @add-node="handleAddNode" @rename-node="handleRenameNode" />
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

const handleAddNode = async (parentId: string | null, type: AddNodeType) => {
  if (type === 'folder') {
    await folderApi.createFolder({
      name: '새 폴더',
      slug: `new-folder-${Date.now()}`,
      parentId: parentId ?? null,
      sortOrder: folders.value.length
    })
  } else {
    const folderId = parentId ?? folders.value[0]?.id ?? ''
    const page = await pageApi.createPage({
      folderId,
      parentPageId: null,
      title: '새 페이지',
      slug: `new-page-${Date.now()}`,
      content: null,
      isPublic: true,
      sortOrder: allPages.value.length
    })
    await pageApi.fetchAllPages()
    router.push('/' + page.slug)
  }
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

const { isDark, currentMode, toggleColorMode } = useThemeStore()

const { setUser } = useAuthStore()
const handleLogout = async () => {
  await $fetch('/api/auth/sign-out', { method: 'POST' }).catch(() => {})
  setUser(null)
  router.push('/')
}
</script>

<style scoped src="~/assets/css/components/templates/SidebarPanel.css"></style>
