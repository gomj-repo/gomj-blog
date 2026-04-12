/** 검색 결과 항목. 페이지 정보에 스니펫과 매칭 위치를 추가한 형태. */
export interface SearchResult {
  id: string
  /** 페이지가 속한 폴더 ID */
  folderId: string
  /** 페이지 제목 */
  title: string
  /** URL 경로용 슬러그 */
  slug: string
  /** 검색용 평문 텍스트 */
  plainText: string | null
  /** 공개 여부 */
  isPublic: boolean
  createdAt: string
  updatedAt: string
  /** 검색어 주변 텍스트 스니펫 */
  snippet: string
  /** 매칭 위치: 제목, 본문, 또는 둘 다 */
  matchField: 'title' | 'content' | 'both'
}
