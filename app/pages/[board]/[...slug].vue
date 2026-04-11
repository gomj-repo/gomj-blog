<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'
import { useReadingTime } from '~/composables/useReadingTime'

const route = useRoute()
const boardName = route.params.board as string

const { boards } = useNavigation()
const validBoard = computed(() => boards.some(b => b.name === boardName))

if (!validBoard.value) {
  throw createError({ statusCode: 404, statusMessage: 'Board not found', fatal: true })
}

const { data: page } = await useAsyncData(`article-${route.path}`, () =>
  queryCollection(boardName as any).path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const readingTime = computed(() => useReadingTime(page.value?.rawbody))

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} | GOMJ Portfolio` : 'GOMJ Portfolio',
  description: () => page.value?.description || '',
  ogTitle: () => page.value?.title || 'GOMJ Portfolio',
  ogDescription: () => page.value?.description || '',
  ogType: 'article',
  twitterCard: 'summary',
  twitterTitle: () => page.value?.title || 'GOMJ Portfolio',
  twitterDescription: () => page.value?.description || '',
})

const { data: allArticles } = await useAsyncData(`nav-${boardName}`, () =>
  queryCollection(boardName as any).where('draft', '<>', true).order('date', 'DESC').all()
)

const currentIndex = computed(() =>
  allArticles.value?.findIndex(a => a.path === route.path) ?? -1
)
const prevArticle = computed(() =>
  currentIndex.value > 0 ? allArticles.value?.[currentIndex.value - 1] : null
)
const nextArticle = computed(() =>
  allArticles.value && currentIndex.value < allArticles.value.length - 1
    ? allArticles.value[currentIndex.value + 1]
    : null
)
</script>

<template>
  <div>
    <ReadingProgress />
    <article v-if="page" class="article-detail__layout">
      <div class="article-detail__main">
        <div class="article-detail__header">
          <h1 class="article-detail__title">{{ page.title }}</h1>
          <ArticleMeta :date="page.date" :tags="page.tags" :reading-time="readingTime" />
        </div>

        <div class="article-detail__body">
          <ContentRenderer :value="page" />
        </div>

        <nav v-if="prevArticle || nextArticle" class="article-detail__nav">
          <NuxtLink
            v-if="prevArticle"
            :to="prevArticle.path"
            class="article-detail__nav-link"
          >
            <span class="article-detail__nav-label">&larr; 이전</span>
            <span class="article-detail__nav-title">{{ prevArticle.title }}</span>
          </NuxtLink>
          <span v-else />
          <NuxtLink
            v-if="nextArticle"
            :to="nextArticle.path"
            class="article-detail__nav-link article-detail__nav-link--next"
          >
            <span class="article-detail__nav-label">다음 &rarr;</span>
            <span class="article-detail__nav-title">{{ nextArticle.title }}</span>
          </NuxtLink>
        </nav>
      </div>

      <aside v-if="page.body?.toc?.links?.length" class="article-detail__toc">
        <TableOfContents :links="page.body.toc.links" />
      </aside>
    </article>
  </div>
</template>
