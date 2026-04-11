<script setup lang="ts">
const visible = ref(false)

function checkScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <Transition name="fade">
    <button
      v-show="visible"
      class="back-to-top"
      aria-label="맨 위로 이동"
      @click="scrollToTop"
    >
      &uarr;
    </button>
  </Transition>
</template>
