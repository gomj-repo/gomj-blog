import { useAuthStore } from '~/composables/store/useAuthStore'
import { useAuthApi } from '~/composables/sideeffect/useAuthApi'

/** 인증 미들웨어. 미로그인 시 세션 확인 후 여전히 미인증이면 로그인 페이지로 리다이렉트한다. */
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated.value) {
    const authApi = useAuthApi()
    await authApi.fetchSession()
    if (!auth.isAuthenticated.value) {
      return navigateTo('/login')
    }
  }
})
