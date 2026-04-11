<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'

const { boards } = useNavigation()

useSeoMeta({
  title: 'GOMJ Portfolio',
  ogTitle: 'GOMJ Portfolio',
  description: 'GOMJ 개발 포트폴리오 & 기술 블로그',
  ogDescription: 'GOMJ 개발 포트폴리오 & 기술 블로그',
  ogType: 'website',
  twitterCard: 'summary',
})

const { data: recentProjects } = await useAsyncData('recent-projects', () =>
  queryCollection('projects').where('draft', '<>', true).order('date', 'DESC').limit(3).all()
)

const { data: recentTil } = await useAsyncData('recent-til', () =>
  queryCollection('til').where('draft', '<>', true).order('date', 'DESC').limit(3).all()
)

const { data: recentNotes } = await useAsyncData('recent-notes', () =>
  queryCollection('notes').where('draft', '<>', true).order('date', 'DESC').limit(3).all()
)

const boardArticlesMap: Record<string, typeof recentProjects> = {
  projects: recentProjects,
  til: recentTil,
  notes: recentNotes,
}

const recentSections = computed(() =>
  boards
    .filter(b => b.name in boardArticlesMap)
    .map(board => ({ board, articles: boardArticlesMap[board.name]?.value ?? [] }))
    .filter(s => s.articles.length > 0)
)
</script>

<template>
  <div>
    <section class="home__hero">
      <h1 class="home__hero-title">GOMJ Portfolio</h1>
      <p class="home__hero-subtitle">개발 포트폴리오 & 기술 블로그</p>
    </section>

    <section v-for="section in recentSections" :key="section.board.name" class="home__section">
      <div class="home__section-header">
        <h2 class="home__section-title">
          {{ section.board.icon }} {{ section.board.label }}
        </h2>
        <NuxtLink :to="`/${section.board.name}`" class="home__section-link">
          전체 보기 &rarr;
        </NuxtLink>
      </div>
      <ArticleList :articles="section.articles" />
    </section>

    <section v-if="!recentSections.length" class="home__section">
      <BaseCard>
        <h2>시작하기</h2>
        <p>
          <code>content/</code> 디렉토리에 Markdown 파일을 추가하여 게시판을 채워보세요.
        </p>
        <ul>
          <li v-for="board in boards" :key="board.name">
            <code>content/{{ board.name }}/</code> — {{ board.description }}
          </li>
        </ul>
      </BaseCard>
    </section>
  </div>
</template>
