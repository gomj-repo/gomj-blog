/** 인증된 사용자 정보 타입. */
interface AuthUser {
  id: string
  name: string
  email: string
}

export const useAuthStore = () => {
  /** 현재 로그인된 사용자. 미로그인이면 `null`. */
  const user = useState<AuthUser | null>('auth-user', () => null)

  /** 로그인 여부 */
  const isAuthenticated = computed(() => !!user.value)
  /** 관리자 여부. 싱글 어드민이므로 로그인 = 관리자. */
  const isAdmin = computed(() => !!user.value)

  const setUser = (value: AuthUser | null) => {
    user.value = value
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    setUser
  }
}
