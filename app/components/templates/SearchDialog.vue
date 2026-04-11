<script setup lang="ts">
const { query, results, isOpen, open, close } = useSearch()
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement>()

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => searchInput.value?.focus())
    selectedIndex.value = 0
  }
})

watch(results, () => {
  selectedIndex.value = 0
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter' && results.value[selectedIndex.value]) {
    e.preventDefault()
    navigateTo(results.value[selectedIndex.value].path)
    close()
  } else if (e.key === 'Escape') {
    close()
  }
}

const boardLabels: Record<string, string> = {
  projects: 'Projects',
  til: 'TIL',
  notes: 'Tech Notes',
  resume: 'Resume',
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (isOpen.value) close()
    else open()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="search-overlay" @click.self="close">
      <div class="search-dialog" @keydown="handleKeydown">
        <div class="search-dialog__input-wrapper">
          <span class="search-dialog__icon">&#128269;</span>
          <input
            ref="searchInput"
            v-model="query"
            type="text"
            class="search-dialog__input"
            placeholder="검색어를 입력하세요..."
          />
          <kbd class="search-dialog__kbd">ESC</kbd>
        </div>

        <div v-if="results.length" class="search-dialog__results">
          <button
            v-for="(result, index) in results"
            :key="result.path"
            :class="['search-dialog__result', { 'search-dialog__result--active': index === selectedIndex }]"
            @click="navigateTo(result.path); close()"
            @mouseenter="selectedIndex = index"
          >
            <div class="search-dialog__result-title">{{ result.title }}</div>
            <div class="search-dialog__result-meta">
              <span class="search-dialog__result-board">{{ boardLabels[result.board] || result.board }}</span>
              <span v-if="result.description" class="search-dialog__result-desc">{{ result.description }}</span>
            </div>
          </button>
        </div>

        <div v-else-if="query.length > 0" class="search-dialog__empty">
          검색 결과가 없습니다
        </div>

        <div v-else class="search-dialog__hint">
          제목, 설명, 태그로 검색할 수 있습니다
        </div>
      </div>
    </div>
  </Teleport>
</template>
