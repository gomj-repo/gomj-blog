<template>
  <nav v-if="items.length > 0" class="sticky top-20 border-l border-(--ui-border-muted)" aria-label="table of contents">
    <p class="mb-3 pl-3 text-xs font-semibold uppercase tracking-wide text-(--ui-text-muted)">
      목차
    </p>
    <ul class="space-y-0.5">
      <TocLink
        v-for="item in items"
        :key="item.id"
        :item="item"
        :active-id="activeId"
        :depth="0"
      />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { TocItem } from '~/composables/action/useTableOfContents'

defineProps<{
  items: TocItem[]
  activeId?: string
}>()

const TocLink = defineComponent({
  name: 'TocLink',
  props: {
    item: { type: Object as PropType<TocItem>, required: true },
    activeId: { type: String, default: undefined },
    depth: { type: Number, default: 0 }
  },
  setup(props) {
    const isActive = computed(() => props.activeId === props.item.id)
    const paddingClass = computed(() => {
      const paddings = ['pl-3', 'pl-5', 'pl-7']
      return paddings[props.depth] ?? 'pl-7'
    })

    return () => {
      const children: VNode[] = []

      children.push(
        h('a', {
          href: `#${props.item.id}`,
          class: [
            'block py-1 text-[13px] border-l-2 -ml-px transition-colors',
            paddingClass.value,
            isActive.value
              ? 'border-(--ui-primary) text-(--ui-primary) font-medium'
              : 'border-transparent text-(--ui-text-muted) hover:text-(--ui-text) hover:border-(--ui-border-accented)'
          ]
        }, props.item.text)
      )

      if (props.item.children.length > 0) {
        children.push(
          h('ul', { class: 'space-y-0.5' },
            props.item.children.map(child =>
              h(TocLink, {
                key: child.id,
                item: child,
                activeId: props.activeId,
                depth: props.depth + 1
              })
            )
          )
        )
      }

      return h('li', null, children)
    }
  }
})
</script>
