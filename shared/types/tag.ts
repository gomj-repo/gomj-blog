/** 저장된 태그 엔티티. */
export interface SavedTag {
  /** 태그 고유 ID */
  id: string
  /** 태그 표시 이름 */
  name: string
  createdAt: string
}

/** 페이지-태그 연결 관계. */
export interface PageTag {
  pageId: string
  tagId: string
}
