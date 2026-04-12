import type { SavedFolder } from '#shared/types/folder'
import type { CreateFolderInput, UpdateFolderInput } from '#shared/schemas/folder.schema'

export type { SavedFolder }

/**
 * 폴더 저장소 인터페이스.
 * 구현체(InMemory, Drizzle)만 교체하면 저장 방식을 변경할 수 있다.
 */
export interface IFolderRepository {
  /** 새 폴더를 생성한다. */
  createFolder(input: CreateFolderInput): Promise<SavedFolder>
  /** ID로 폴더를 조회한다. */
  getFolder(id: string): Promise<SavedFolder | null>
  /** 부모 ID + 슬러그 조합으로 폴더를 조회한다. */
  getFolderBySlug(parentId: string | null, slug: string): Promise<SavedFolder | null>
  /** 전체 폴더 목록을 반환한다. */
  listFolders(): Promise<SavedFolder[]>
  /** 특정 부모 아래의 자식 폴더 목록을 반환한다. */
  listChildFolders(parentId: string | null): Promise<SavedFolder[]>
  /** 폴더 정보를 수정한다. */
  updateFolder(id: string, input: Partial<UpdateFolderInput>): Promise<SavedFolder | null>
  /** 폴더를 삭제한다. 하위 폴더·페이지도 함께 제거된다. */
  deleteFolder(id: string): Promise<boolean>
  /** 같은 부모 아래 폴더들의 정렬 순서를 재지정한다. */
  reorderFolders(parentId: string | null, orderedIds: string[]): Promise<void>
}
