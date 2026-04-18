import { useAuthStore } from '~/composables/store/useAuthStore'

export const useAuthApi = () => {
  const store = useAuthStore()

  /** 현재 세션 정보를 서버에서 가져와 스토어에 반영한다. */
  const fetchSession = async () => {
    try {
      const data = await $fetch<{ user: { id: string; name: string; email: string } | null }>('/api/auth/get-session', {
        headers: useRequestHeaders(['cookie'])
      })
      store.setUser(data?.user ?? null)
    } catch {
      store.setUser(null)
    }
  }

  /**
   * 이메일·비밀번호로 로그인한다.
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   */
  const login = async (email: string, password: string) => {
    await $fetch('/api/auth/sign-in/email', {
      method: 'POST',
      body: { email, password }
    })
    await fetchSession()
  }

  /** 로그아웃한다. */
  const logout = async () => {
    await $fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: useRequestHeaders(['cookie'])
    })
    store.setUser(null)
  }

  return {
    fetchSession,
    login,
    logout
  }
}
