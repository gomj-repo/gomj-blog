<template>
  <div
    v-if="isAuthenticated && user"
    class="flex items-center gap-2 px-3 py-2"
  >
    <UAvatar
      :alt="user.name"
      size="xs"
      class="shrink-0"
    />
    <div v-if="!collapsed" class="flex-1 min-w-0">
      <p class="text-xs font-medium truncate text-neutral-200">{{ user.name }}</p>
      <p class="text-xs truncate text-neutral-400 opacity-60">{{ user.email }}</p>
    </div>
    <UButton
      v-if="!collapsed"
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-log-out"
      class="ml-auto opacity-60 hover:opacity-100"
      aria-label="Sign out"
      @click="emit('logout')"
    />
  </div>
  <NuxtLink v-else to="/login" class="flex items-center gap-2 px-3 py-2 text-[0.8125rem] no-underline opacity-70 hover:opacity-100">
    <UIcon name="i-lucide-log-in" class="shrink-0" />
    <span v-if="!collapsed">로그인</span>
  </NuxtLink>
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
