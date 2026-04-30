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
  <div class="flex items-center justify-center min-h-screen p-4">
    <form class="flex flex-col gap-5 w-full max-w-[360px]" @submit.prevent="handleSubmit">
      <h1 class="text-2xl font-bold text-center">GOMJ Wiki</h1>
      <p class="text-sm text-center text-[var(--ui-text-muted)] -mt-3">관리자 로그인</p>

      <UFormField label="이메일">
        <UInput
          v-model="email"
          type="email"
          placeholder="admin@gomj.dev"
          required
          autofocus
          class="w-full"
        />
      </UFormField>

      <UFormField label="비밀번호">
        <UInput
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          required
          class="w-full"
        />
      </UFormField>

      <p v-if="error" class="text-[0.8125rem] text-red-500 text-center">{{ error }}</p>

      <UButton
        type="submit"
        block
        :loading="loading"
        class="mt-2"
      >
        로그인
      </UButton>
    </form>
  </div>
</template>
