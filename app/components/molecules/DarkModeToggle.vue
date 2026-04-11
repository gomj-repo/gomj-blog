<script setup lang="ts">
const { isDark, toggle, init } = useDarkMode()

onMounted(() => {
  init()
})
</script>

<template>
  <button
    class="dark-toggle"
    :aria-label="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
    @click="toggle"
  >
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>
