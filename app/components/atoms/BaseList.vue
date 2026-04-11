<script setup lang="ts" generic="T">
interface Props {
  items: T[]
  emptyText?: string
}

withDefaults(defineProps<Props>(), {
  emptyText: '항목이 없습니다.',
})
</script>

<template>
  <ul v-if="items.length" class="base-list">
    <li v-for="(item, index) in items" :key="index" class="base-list__item">
      <slot name="item" :item="item" :index="index" />
    </li>
  </ul>
  <div v-else class="base-list__empty">
    <slot name="empty">
      {{ emptyText }}
    </slot>
  </div>
</template>
