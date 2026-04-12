import type { SavedPage } from '#shared/types/page'
import type { CreatePageInput, UpdatePageInput } from '#shared/schemas/page.schema'

export type { SavedPage }

/**
 * 페이지 저장소 인터페이스.
 * 구현체(InMemory, Drizzle)만 교체하면 저장 방식을 변경할 수 있다.
 */
export interface IPageRepository {
  /** 새 페이지를 생성한다. */
  createPage(input: CreatePageInput): Promise<SavedPage>
  /** ID로 페이지를 조회한다. */
  getPage(id: string): Promise<SavedPage | null>
  /** 폴더 ID + 슬러그 조합으로 페이지를 조회한다. */
  getPageBySlug(folderId: string, slug: string): Promise<SavedPage | null>
  /** 모든 페이지 목록을 반환한다. */
  listAllPages(): Promise<SavedPage[]>
  /** 특정 폴더에 속한 페이지 목록을 반환한다. */
  listPagesByFolder(folderId: string): Promise<SavedPage[]>
  /** 공개 페이지를 최신순으로 반환한다. */
  listPublicPages(limit?: number): Promise<SavedPage[]>
  /** 페이지 정보를 수정한다. */
  updatePage(id: string, input: Partial<UpdatePageInput>): Promise<SavedPage | null>
  /** 페이지를 삭제한다. */
  deletePage(id: string): Promise<boolean>
  /** 폴더 내 페이지들의 정렬 순서를 재지정한다. */
  reorderPages(folderId: string, orderedIds: string[]): Promise<void>
}
