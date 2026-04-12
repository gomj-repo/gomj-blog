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
        @add-root="(type) => handleAddNode(null, type)"
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

import type { AddNodeType } from '~/components/mocules/SidebarSearchInput.vue'
import type { SavedPage } from '#shared/types/page'

const { folders, setFolders } = useFolderStore()
const { allPages, setAllPages } = usePageStore()

const handleAddNode = (parentId: string | null, type: AddNodeType) => {
  if (type === 'folder') {
    const newFolder: import('#shared/types/folder').SavedFolder = {
      id: crypto.randomUUID(),
      name: '새 폴더',
      slug: `new-folder-${Date.now()}`,
      parentId,
      sortOrder: folders.value.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setFolders([...folders.value, newFolder])
  } else {
    const folderId = parentId ?? folders.value[0]?.id ?? ''
    const newPage: SavedPage = {
      id: crypto.randomUUID(),
      folderId,
      parentPageId: null,
      title: '새 페이지',
      slug: `new-page-${Date.now()}`,
      content: null,
      plainText: null,
      isPublic: false,
      sortOrder: allPages.value.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setAllPages([...allPages.value, newPage])
    router.push('/' + newPage.slug)
  }
}

const handleRenameNode = (id: string, name: string) => {
  const folder = folders.value.find(f => f.id === id)
  if (folder) {
    setFolders(folders.value.map(f => f.id === id ? { ...f, name, updatedAt: new Date().toISOString() } : f))
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
