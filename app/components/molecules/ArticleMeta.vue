<script setup lang="ts">
interface Props {
  date?: string
  tags?: string[]
  readingTime?: string
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  if (!props.date) return ''
  return new Date(props.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

function handleTagClick(e: Event, tag: string) {
  e.preventDefault()
  e.stopPropagation()
  navigateTo(`/tags/${tag}`)
}
</script>

<template>
  <div class="article-meta">
    <span v-if="date" class="article-meta__date">
      {{ formattedDate }}
    </span>
    <span v-if="readingTime" class="article-meta__reading-time">
      {{ readingTime }}
    </span>
    <template v-if="tags?.length">
      <BaseBadge
        v-for="tag in tags"
        :key="tag"
        variant="primary"
        class="article-meta__tag"
        @click="handleTagClick($event, tag)"
      >
        {{ tag }}
      </BaseBadge>
    </template>
  </div>
</template>
