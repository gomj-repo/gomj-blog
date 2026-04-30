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
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="GOMJ Wiki" />
    </template>

    <template #body>
      <p class="text-sm text-neutral-400">사이드바에서 페이지를 선택하세요.</p>
    </template>
  </UDashboardPanel>
</template>
