<script setup lang="ts">
import { useTags } from '~/composables/useTags'

const route = useRoute()
const tag = (route.params.tag as string).replace(/[<>"'&]/g, '')

useSeoMeta({
  title: `#${tag} | GOMJ Portfolio`,
  ogTitle: `#${tag} | GOMJ Portfolio`,
  description: `태그: ${tag}`,
  ogDescription: `태그: ${tag}`,
  twitterCard: 'summary',
})

const { fetchAllArticles, getArticlesByTag } = useTags()

const { data: allArticles } = await useAsyncData(`tag-${tag}`, fetchAllArticles)
const articles = computed(() => getArticlesByTag(allArticles.value ?? [], tag))
</script>

<template>
  <div>
    <div class="board__header">
      <h1 class="board__title">🏷️ #{{ tag }}</h1>
      <p class="board__description">태그: {{ tag }}</p>
      <p v-if="articles.length" class="board__count">{{ articles.length }}개의 게시글</p>
    </div>

    <ArticleList
      :articles="articles"
      :empty-text="`'${tag}' 태그가 있는 게시글이 없습니다.`"
    />
  </div>
</template>
