import type { SavedTag, PageTag } from '#shared/types/tag'
import type { SavedPage } from '#shared/types/page'
import type { CreateTagInput } from '#shared/schemas/tag.schema'

export type { SavedTag, PageTag }

/**
 * 태그 저장소 인터페이스.
 * 태그 CRUD와 페이지-태그 연결 관리를 담당한다.
 */
export interface ITagRepository {
  /** 새 태그를 생성한다. */
  createTag(input: CreateTagInput): Promise<SavedTag>
  /** ID로 태그를 조회한다. */
  getTag(id: string): Promise<SavedTag | null>
  /** 이름으로 태그를 조회한다. */
  getTagByName(name: string): Promise<SavedTag | null>
  /** 전체 태그 목록을 반환한다. */
  listTags(): Promise<SavedTag[]>
  /** 태그를 삭제한다. 페이지 연결도 함께 제거된다. */
  deleteTag(id: string): Promise<boolean>
  /** 페이지에 태그를 연결한다. */
  addTagToPage(pageId: string, tagId: string): Promise<void>
  /** 페이지에서 태그 연결을 해제한다. */
  removeTagFromPage(pageId: string, tagId: string): Promise<boolean>
  /** 특정 페이지에 연결된 태그 목록을 반환한다. */
  getTagsByPage(pageId: string): Promise<SavedTag[]>
  /** 특정 태그가 연결된 페이지 목록을 반환한다. */
  getPagesByTag(tagId: string): Promise<SavedPage[]>
}
