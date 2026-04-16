/** 저장된 북마크 도메인 타입. 사용자와 페이지 간 즐겨찾기 관계를 나타낸다. */
export interface SavedBookmark {
  /** 북마크를 등록한 사용자 ID */
  userId: string
  /** 북마크된 페이지 ID */
  pageId: string
  /** 북마크 등록 시각 (ISO 8601) */
  createdAt: string
}
