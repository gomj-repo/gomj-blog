<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'
import { useBoardMeta } from '~/composables/useBoardMeta'

const route = useRoute()
const boardName = route.params.board as string

const { boards } = useNavigation()
const { boardLabel, boardDescription, boardIcon } = useBoardMeta(boardName)

const validBoard = computed(() => boards.some(b => b.name === boardName))

if (!validBoard.value) {
  throw createError({ statusCode: 404, statusMessage: 'Board not found', fatal: true })
}

useSeoMeta({
  title: () => `${boardLabel.value} | GOMJ Portfolio`,
  description: () => boardDescription.value || '',
  ogTitle: () => `${boardLabel.value} | GOMJ Portfolio`,
  ogDescription: () => boardDescription.value || '',
  twitterCard: 'summary',
})

const { data: articles } = await useAsyncData(`board-${boardName}`, () =>
  queryCollection(boardName as any).where('draft', '<>', true).order('date', 'DESC').all()
)
</script>

<template>
  <div>
    <div class="board__header">
      <h1 class="board__title">{{ boardIcon }} {{ boardLabel }}</h1>
      <p class="board__description">{{ boardDescription }}</p>
      <p v-if="articles?.length" class="board__count">
        {{ articles.length }}개의 게시글
      </p>
    </div>

    <ArticleList
      :articles="articles ?? []"
      :empty-text="`${boardLabel}에 게시글이 없습니다. content/${boardName}/ 에 Markdown 파일을 추가해보세요.`"
    />
  </div>
</template>
