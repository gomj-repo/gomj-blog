<script setup lang="ts">
import { useTags } from '~/composables/useTags'

useSeoMeta({
  title: 'Tags | GOMJ Portfolio',
  ogTitle: 'Tags | GOMJ Portfolio',
  description: '전체 태그 목록',
  ogDescription: '전체 태그 목록',
  twitterCard: 'summary',
})

const { fetchAllArticles, getAllTags } = useTags()

const { data: articles } = await useAsyncData('all-articles-tags', fetchAllArticles)
const tags = computed(() => getAllTags(articles.value ?? []))

const maxCount = computed(() => Math.max(...tags.value.map(t => t.count), 1))
</script>

<template>
  <div>
    <div class="board__header">
      <h1 class="board__title">🏷️ Tags</h1>
      <p class="board__description">전체 태그 목록</p>
      <p v-if="tags.length" class="board__count">{{ tags.length }}개의 태그</p>
    </div>

    <div class="tag-cloud">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tags/${tag.name}`"
        class="tag-cloud__item"
        :style="{ fontSize: `${0.75 + (tag.count / maxCount) * 0.75}rem` }"
      >
        {{ tag.name }}
        <span class="tag-cloud__count">{{ tag.count }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
