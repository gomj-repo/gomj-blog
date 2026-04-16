<template>
  <nav v-if="items.length > 0" class="toc-nav" aria-label="table of contents">
    <h4 class="toc-title">목차</h4>
    <ul class="toc-list">
      <li v-for="item in items" :key="item.id" class="toc-item">
        <a :href="'#' + item.id" class="toc-link" :class="{ 'is-active': activeId === item.id }">
          {{ item.text }}
        </a>
        <ul v-if="item.children.length > 0" class="toc-sublist">
          <li v-for="child in item.children" :key="child.id" class="toc-item toc-item--sub">
            <a :href="'#' + child.id" class="toc-link" :class="{ 'is-active': activeId === child.id }">
              {{ child.text }}
            </a>
            <ul v-if="child.children.length > 0" class="toc-sublist">
              <li v-for="grandchild in child.children" :key="grandchild.id" class="toc-item toc-item--sub2">
                <a :href="'#' + grandchild.id" class="toc-link" :class="{ 'is-active': activeId === grandchild.id }">
                  {{ grandchild.text }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { TocItem } from '~/composables/action/useTableOfContents'

defineProps<{
  items: TocItem[]
  activeId?: string
}>()
</script>

<style scoped>
.toc-nav {
  position: sticky;
  top: 20px;
  padding: 16px;
  border-left: 2px solid var(--color-border, #e0e0e0);
  font-size: 0.8125rem;
}
.toc-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary, #666);
  margin: 0 0 12px;
}
.toc-list, .toc-sublist {
  list-style: none;
  margin: 0;
  padding: 0;
}
.toc-sublist {
  padding-left: 12px;
}
.toc-item {
  margin: 4px 0;
}
.toc-link {
  color: var(--color-text-secondary, #666);
  text-decoration: none;
  display: block;
  padding: 2px 0;
  transition: color 0.15s;
}
.toc-link:hover,
.toc-link.is-active {
  color: var(--color-text-primary, #333);
}
.toc-link.is-active {
  font-weight: 500;
}
</style>
