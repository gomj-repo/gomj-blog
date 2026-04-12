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
      <SidebarNavTree :collapsed="collapsed" @navigate="handleNavigate" />
    </template>

    <template #footer="{ collapsed }">
      <div class="flex items-center px-3 py-2 border-t border-[var(--sidebar-border)]">
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:bg-[var(--sidebar-item-hover)]"
          @click="toggleColorMode"
        />
        <span
          v-if="!collapsed"
          class="ml-2 text-xs text-[var(--sidebar-text)] opacity-40 select-none"
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

const { isDark, currentMode, toggleColorMode } = useThemeStore()

const { setUser } = useAuthStore()
const handleLogout = async () => {
  await $fetch('/api/auth/sign-out', { method: 'POST' }).catch(() => {})
  setUser(null)
  router.push('/')
}
</script>
