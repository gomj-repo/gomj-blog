<template>
  <div
    v-if="isAuthenticated && user"
    class="sidebar-user-profile"
  >
    <UAvatar
      :alt="user.name"
      size="xs"
      class="shrink-0"
    />
    <div v-if="!collapsed" class="flex-1 min-w-0">
      <p class="sidebar-user-profile__name">{{ user.name }}</p>
      <p class="sidebar-user-profile__email">{{ user.email }}</p>
    </div>
    <UButton
      v-if="!collapsed"
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-log-out"
      class="sidebar-user-profile__logout"
      aria-label="Sign out"
      @click="emit('logout')"
    />
  </div>
  <NuxtLink v-else to="/login" class="sidebar-user-profile sidebar-user-profile--login">
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

<style scoped src="~/assets/css/components/molecules/SidebarUserProfile.css"></style>
