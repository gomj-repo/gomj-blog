<script setup lang="ts">
const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

const route = useRoute()
watch(() => route.path, closeSidebar)
</script>

<template>
  <div class="app-layout">
    <div
      :class="['app-layout__sidebar', { 'app-layout__sidebar--open': sidebarOpen }]"
    >
      <AppSidebar />
    </div>

    <div
      :class="['app-layout__overlay', { 'app-layout__overlay--visible': sidebarOpen }]"
      @click="closeSidebar"
    />

    <div class="app-layout__main">
      <div class="app-layout__header">
        <AppHeader @toggle-sidebar="toggleSidebar" />
      </div>
      <main class="app-layout__content">
        <slot />
      </main>
      <AppFooter />
    </div>
    <BackToTop />
    <SearchDialog />
  </div>
</template>
