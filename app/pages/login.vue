<script setup lang="ts">
definePageMeta({ layout: false })

const { isAuthenticated } = useAuthStore()
const { login } = useAuthApi()
const router = useRouter()

if (isAuthenticated.value) {
  router.replace('/')
}

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.replace('/')
  } catch {
    error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h1 class="login-form__title">GOMJ Wiki</h1>
      <p class="login-form__subtitle">관리자 로그인</p>

      <UFormField label="이메일">
        <UInput
          v-model="email"
          type="email"
          placeholder="admin@gomj.dev"
          required
          autofocus
          class="login-form__input"
        />
      </UFormField>

      <UFormField label="비밀번호">
        <UInput
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          required
          class="login-form__input"
        />
      </UFormField>

      <p v-if="error" class="login-form__error">{{ error }}</p>

      <UButton
        type="submit"
        block
        :loading="loading"
        class="login-form__submit"
      >
        로그인
      </UButton>
    </form>
  </div>
</template>

<style scoped src="~/assets/css/pages/login.css"></style>
