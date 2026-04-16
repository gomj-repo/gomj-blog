import type { SavedTemplate } from '#shared/types/template'
import type { CreateTemplateInput, UpdateTemplateInput } from '#shared/schemas/template.schema'

export type { SavedTemplate }

/**
 * 페이지 템플릿 저장소 인터페이스.
 * 구현체(InMemory, Drizzle)만 교체하면 저장 방식을 변경할 수 있다.
 */
export interface ITemplateRepository {
  /** 새 템플릿을 생성한다. */
  createTemplate(input: CreateTemplateInput): Promise<SavedTemplate>
  /** ID로 템플릿을 조회한다. */
  getTemplate(id: string): Promise<SavedTemplate | null>
  /** 전체 템플릿 목록을 반환한다. */
  listTemplates(): Promise<SavedTemplate[]>
  /** 템플릿 정보를 수정한다. */
  updateTemplate(id: string, input: Partial<UpdateTemplateInput>): Promise<SavedTemplate | null>
  /** 템플릿을 삭제한다. */
  deleteTemplate(id: string): Promise<boolean>
}
