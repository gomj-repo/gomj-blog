/** 저장된 폴더 엔티티. API 응답에서 반환되는 형태. */
export interface SavedFolder {
  /** 폴더 고유 ID */
  id: string
  /** 상위 폴더 ID. `null`이면 루트 폴더. */
  parentId: string | null
  /** 폴더 표시 이름 */
  name: string
  /** URL 경로용 슬러그 */
  slug: string
  /** 같은 레벨 내 정렬 순서 */
  sortOrder: number
  createdAt: string
  updatedAt: string
}
