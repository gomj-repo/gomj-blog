/** 저장된 페이지 템플릿 엔티티. API 응답에서 반환되는 형태. */
export interface SavedTemplate {
  /** 템플릿 고유 ID */
  id: string
  /** 템플릿 이름 */
  name: string
  /** 템플릿 설명. 없으면 `null`. */
  description: string | null
  /** TipTap JSON 기본 본문. 없으면 `null`. */
  content: Record<string, unknown> | null
  /** 기본 템플릿 여부 */
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
