export const useThemeStore = () => {
  const colorMode = useColorMode()

  /** 다크 모드 여부. */
  const isDark = computed(() => colorMode.value === 'dark')
  /** 현재 색상 모드 (`light`, `dark`, `system`). */
  const currentMode = computed(() => colorMode.value)

  /** 색상 모드를 지정된 값으로 설정한다. */
  const setColorMode = (mode: 'light' | 'dark' | 'system') => {
    colorMode.preference = mode
  }

  /** light -> dark -> system 순서로 색상 모드를 순환한다. */
  const toggleColorMode = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(colorMode.preference as 'light' | 'dark' | 'system')
    const nextIndex = (currentIndex + 1) % modes.length
    colorMode.preference = modes[nextIndex]
  }

  return {
    isDark,
    currentMode,
    setColorMode,
    toggleColorMode
  }
}
