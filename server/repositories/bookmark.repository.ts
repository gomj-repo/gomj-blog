import type { SavedBookmark } from '#shared/types/bookmark'

export type { SavedBookmark }

/**
 * 북마크 저장소 인터페이스.
 * 사용자별 페이지 즐겨찾기 추가·제거·조회를 담당한다.
 */
export interface IBookmarkRepository {
  /** 북마크를 추가한다. */
  addBookmark(userId: string, pageId: string): Promise<SavedBookmark>
  /** 북마크를 제거한다. 성공 여부를 반환한다. */
  removeBookmark(userId: string, pageId: string): Promise<boolean>
  /** 특정 사용자의 북마크 목록을 반환한다. */
  listBookmarksByUser(userId: string): Promise<SavedBookmark[]>
  /** 특정 사용자가 해당 페이지를 북마크했는지 확인한다. */
  isBookmarked(userId: string, pageId: string): Promise<boolean>
}
