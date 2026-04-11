<script setup lang="ts">
const copied = ref(false)
const preRef = ref<HTMLElement>()

async function copyCode() {
  const code = preRef.value?.querySelector('code')?.textContent || ''
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = code
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div class="prose-pre-wrapper">
    <button
      class="prose-pre__copy"
      :class="{ 'prose-pre__copy--copied': copied }"
      @click="copyCode"
    >
      {{ copied ? '복사됨!' : '복사' }}
    </button>
    <pre ref="preRef"><slot /></pre>
  </div>
</template>
