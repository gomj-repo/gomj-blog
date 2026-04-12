<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; message?: string }
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4">
    <span class="text-6xl font-bold text-gray-400">{{ error.statusCode }}</span>
    <p class="text-gray-500">
      {{ error.statusCode === 404 ? '페이지를 찾을 수 없습니다' : '서버 오류가 발생했습니다' }}
    </p>
    <button
      class="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
      @click="clearError({ redirect: '/' })"
    >
      홈으로 돌아가기
    </button>
  </div>
</template>
