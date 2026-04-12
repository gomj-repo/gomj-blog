<template>
  <div
    v-if="isAuthenticated && user"
    class="flex items-center gap-2 px-3 py-2 border-t border-[var(--sidebar-border)]"
  >
    <UAvatar
      :alt="user.name"
      size="xs"
      class="shrink-0"
    />
    <div v-if="!collapsed" class="flex-1 min-w-0">
      <p class="text-xs font-medium truncate text-[var(--sidebar-text)]">{{ user.name }}</p>
      <p class="text-xs truncate text-[var(--sidebar-text)] opacity-60">{{ user.email }}</p>
    </div>
    <UButton
      v-if="!collapsed"
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-log-out"
      class="shrink-0 text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:bg-[var(--sidebar-item-hover)]"
      aria-label="Sign out"
      @click="emit('logout')"
    />
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated } = useAuthStore()

defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  logout: []
}>()
</script>
