/** 저장된 페이지 엔티티. API 응답에서 반환되는 형태. */
export interface SavedPage {
  /** 페이지 고유 ID */
  id: string
  /** 소속 폴더 ID */
  folderId: string
  /** 상위 페이지 ID. `null`이면 폴더 직속 루트 페이지. */
  parentPageId: string | null
  /** 페이지 제목 */
  title: string
  /** URL 경로용 슬러그 */
  slug: string
  /** TipTap JSON 본문. 빈 페이지면 `null`. */
  content: Record<string, unknown> | null
  /** 검색용 평문 텍스트 */
  plainText: string | null
  /** 공개 여부 */
  isPublic: boolean
  /** 페이지 상태. draft / published / archived */
  status: string
  /** 폴더 내 정렬 순서 */
  sortOrder: number
  createdAt: string
  updatedAt: string
}
