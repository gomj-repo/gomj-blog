<script setup lang="ts">
interface Article {
  path: string
  title: string
  description?: string
  date?: string
  tags?: string[]
}

interface Props {
  articles: Article[]
  emptyText?: string
}

withDefaults(defineProps<Props>(), {
  emptyText: '게시글이 없습니다.',
})
</script>

<template>
  <BaseList :items="articles" :empty-text="emptyText">
    <template #item="{ item }">
      <ArticleCard
        :title="item.title"
        :description="item.description"
        :date="item.date"
        :tags="item.tags"
        :to="item.path"
      />
    </template>
    <template #empty>
      <p>{{ emptyText }}</p>
    </template>
  </BaseList>
</template>
