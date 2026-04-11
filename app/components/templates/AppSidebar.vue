<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'

const { boards, isActiveBoard } = useNavigation()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__logo">
      <NuxtLink to="/">GOMJ Portfolio</NuxtLink>
    </div>
    <nav class="sidebar__nav">
      <div class="sidebar__section">
        <div class="sidebar__section-title">Boards</div>
        <NuxtLink
          v-for="board in boards"
          :key="board.name"
          :to="`/${board.name}`"
          :class="['sidebar__link', { 'sidebar__link--active': isActiveBoard(board.name) }]"
        >
          <span class="sidebar__link-icon">{{ board.icon }}</span>
          {{ board.label }}
        </NuxtLink>
      </div>
      <div class="sidebar__section">
        <div class="sidebar__section-title">Browse</div>
        <NuxtLink to="/tags" :class="['sidebar__link', { 'sidebar__link--active': $route.path.startsWith('/tags') }]">
          <span class="sidebar__link-icon">🏷️</span>
          Tags
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>
