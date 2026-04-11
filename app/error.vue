<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

function handleBack() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-page__content">
      <h1 class="error-page__code">{{ error.statusCode }}</h1>
      <p class="error-page__message">{{ error.statusCode === 404 ? '페이지를 찾을 수 없습니다' : '오류가 발생했습니다' }}</p>
      <p class="error-page__description">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
      <button class="error-page__button" @click="handleBack">홈으로 돌아가기</button>
    </div>
  </div>
</template>
