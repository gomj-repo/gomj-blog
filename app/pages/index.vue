<script setup lang="ts">
import { useFolderApi } from '~/composables/sideeffect/useFolderApi'
import { usePageApi } from '~/composables/sideeffect/usePageApi'

const folderApi = useFolderApi()
const pageApi = usePageApi()

onMounted(async () => {
  await Promise.all([
    folderApi.fetchFolders(),
    pageApi.fetchAllPages()
  ])
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-semibold text-neutral-100">GOMJ Wiki</h1>
    <p class="mt-2 text-sm text-neutral-400">사이드바에서 페이지를 선택하세요.</p>
  </div>
</template>
