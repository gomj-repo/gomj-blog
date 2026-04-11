<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

defineProps<{
  links: TocLink[]
}>()

const activeId = ref('')

function flattenLinks(links: TocLink[]): TocLink[] {
  return links.reduce<TocLink[]>((acc, link) => {
    acc.push(link)
    if (link.children) {
      acc.push(...flattenLinks(link.children))
    }
    return acc
  }, [])
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -80% 0px' }
  )

  document.querySelectorAll('.article-detail__body h2, .article-detail__body h3').forEach(el => {
    observer.observe(el)
  })

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div v-if="links?.length" class="toc">
    <details class="toc__mobile" open>
      <summary class="toc__title">목차</summary>
      <nav class="toc__nav">
        <ul class="toc__list">
          <li
            v-for="link in flattenLinks(links)"
            :key="link.id"
            :class="['toc__item', `toc__item--depth-${link.depth}`, { 'toc__item--active': activeId === link.id }]"
          >
            <a :href="`#${link.id}`" class="toc__link">{{ link.text }}</a>
          </li>
        </ul>
      </nav>
    </details>
  </div>
</template>
