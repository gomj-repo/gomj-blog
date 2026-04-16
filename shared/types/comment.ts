/** 저장된 댓글 엔티티. API 응답에서 반환되는 형태. */
export interface SavedComment {
  /** 댓글 고유 ID */
  id: string
  /** 댓글이 달린 페이지 ID */
  pageId: string
  /** 작성자 사용자 ID */
  userId: string
  /** 부모 댓글 ID. `null`이면 최상위 댓글. */
  parentId: string | null
  /** 댓글 본문 */
  content: string
  createdAt: string
  updatedAt: string
}
