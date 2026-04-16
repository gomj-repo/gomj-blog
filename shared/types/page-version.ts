/** 저장된 페이지 버전 스냅샷 타입. */
export interface SavedPageVersion {
  /** 버전 고유 ID */
  id: string
  /** 원본 페이지 ID */
  pageId: string
  /** 버전 번호 */
  versionNumber: number
  /** 해당 시점의 페이지 제목 */
  title: string
  /** 해당 시점의 TipTap JSON 본문 */
  content: Record<string, unknown> | null
  /** 해당 시점의 평문 텍스트 */
  plainText: string | null
  /** 버전 생성 시각 (ISO 8601) */
  createdAt: string
}
