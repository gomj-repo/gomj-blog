import type { SearchResult } from '#shared/types/search'
import { useSearchStore } from '~/composables/store/useSearchStore'

export const useSearchApi = () => {
  const store = useSearchStore()
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 키워드로 페이지를 검색한다. 300ms 디바운스를 적용하여 타이핑 중 과도한 요청을 방지한다.
   * 2자 미만이면 결과를 초기화한다.
   */
  const searchPages = (query: string) => {
    store.setSearchQuery(query)

    if (debounceTimer) clearTimeout(debounceTimer)

    if (query.trim().length < 2) {
      store.setSearchResults([])
      store.setIsSearching(false)
      return
    }

    store.setIsSearching(true)

    debounceTimer = setTimeout(async () => {
      try {
        const data = await $fetch<SearchResult[]>('/api/search', {
          params: { q: query.trim() }
        })
        store.setSearchResults(data)
      } catch {
        store.setSearchResults([])
      } finally {
        store.setIsSearching(false)
      }
    }, 300) // 300ms 디바운스
  }

  /** 검색 상태를 초기화한다. */
  const clearSearch = () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    store.setSearchQuery('')
    store.setSearchResults([])
    store.setIsSearching(false)
  }

  return {
    searchPages,
    clearSearch
  }
}
