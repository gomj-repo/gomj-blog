<script setup lang="ts">
defineEmits<{
  toggleSidebar: []
}>()

const { open: searchOpen } = useSearch()
</script>

<template>
  <header class="header">
    <button class="header__menu-btn" aria-label="메뉴 열기" @click="$emit('toggleSidebar')">
      &#9776;
    </button>
    <div class="header__breadcrumb">
      <AppBreadcrumb />
    </div>
    <button class="search-trigger" aria-label="검색" @click="searchOpen">
      &#128269; <kbd class="search-trigger__kbd">⌘K</kbd>
    </button>
    <DarkModeToggle />
  </header>
</template>
