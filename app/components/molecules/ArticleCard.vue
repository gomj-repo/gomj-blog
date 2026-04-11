<script setup lang="ts">
import { useReadingTime } from '~/composables/useReadingTime'

interface Props {
  title: string
  description?: string
  date?: string
  tags?: string[]
  to: string
  rawText?: string
}

const props = defineProps<Props>()

const readingTime = computed(() => useReadingTime(props.rawText))
</script>

<template>
  <NuxtLink :to="to" class="article-card">
    <BaseCard hoverable>
      <h3 class="article-card__title">{{ title }}</h3>
      <p v-if="description" class="article-card__description">{{ description }}</p>
      <ArticleMeta :date="date" :tags="tags" :reading-time="readingTime" />
    </BaseCard>
  </NuxtLink>
</template>
