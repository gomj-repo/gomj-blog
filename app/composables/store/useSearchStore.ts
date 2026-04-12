import type { SearchResult } from '#shared/types/search'

export const useSearchStore = () => {
  /** 현재 검색어. */
  const searchQuery = useState<string>('search-query', () => '')
  /** 검색 결과 목록. */
  const searchResults = useState<SearchResult[]>('search-results', () => [])
  /** 검색 진행 중 여부. */
  const isSearching = useState<boolean>('is-searching', () => false)

  const setSearchQuery = (value: string) => {
    searchQuery.value = value
  }

  const setSearchResults = (value: SearchResult[]) => {
    searchResults.value = value
  }

  const setIsSearching = (value: boolean) => {
    isSearching.value = value
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    setSearchQuery,
    setSearchResults,
    setIsSearching
  }
}
