import type { SearchResult } from '#shared/types/search'

/**
 * 검색 저장소 인터페이스.
 * 페이지 제목과 본문에서 키워드를 검색한다.
 */
export interface ISearchRepository {
  /** 키워드로 페이지를 검색한다. `includePrivate`가 `true`이면 비공개 페이지도 포함. */
  searchPages(query: string, includePrivate: boolean, limit?: number): Promise<SearchResult[]>
}
