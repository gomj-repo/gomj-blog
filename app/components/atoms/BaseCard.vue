<script setup lang="ts">
interface Props {
  tag?: string
  hoverable?: boolean
  flat?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  hoverable: false,
  flat: false,
})

const classes = computed(() => [
  'base-card',
  { 'base-card--hoverable': props.hoverable },
  { 'base-card--flat': props.flat },
])
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
