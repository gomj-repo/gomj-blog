export function useDarkMode() {
  const isDark = useState('dark-mode', () => false)

  function applyTheme(dark: boolean) {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  function init() {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme(isDark.value)
    }
  }

  return { isDark, toggle, init }
}
