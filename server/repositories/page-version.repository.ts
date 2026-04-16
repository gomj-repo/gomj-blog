import type { SavedPageVersion } from '#shared/types/page-version'

export type { SavedPageVersion }

/**
 * 페이지 버전 저장소 인터페이스.
 * 구현체(InMemory, Drizzle)만 교체하면 저장 방식을 변경할 수 있다.
 */
export interface IPageVersionRepository {
  /** 현재 페이지 내용을 버전으로 스냅샷한다. */
  createVersion(pageId: string, title: string, content: unknown, plainText: string | null): Promise<SavedPageVersion>
  /** 특정 페이지의 모든 버전 목록을 최신순으로 반환한다. */
  listVersions(pageId: string): Promise<SavedPageVersion[]>
  /** 버전 ID로 특정 버전을 조회한다. */
  getVersion(id: string): Promise<SavedPageVersion | null>
  /** 특정 페이지의 최신 버전 번호를 반환한다. 버전이 없으면 0을 반환한다. */
  getLatestVersionNumber(pageId: string): Promise<number>
}
