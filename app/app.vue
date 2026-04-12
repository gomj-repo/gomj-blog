<script setup lang="ts">
/** 앱 루트 컴포넌트. 마운트 시 세션을 확인하여 인증 상태를 초기화한다. */
import { useAuthApi } from '~/composables/sideeffect/useAuthApi'

onMounted(async () => {
  const authApi = useAuthApi()
  await authApi.fetchSession()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
