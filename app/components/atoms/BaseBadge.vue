<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <span :class="['base-badge', `base-badge--${variant}`]">
    <slot />
  </span>
</template>
