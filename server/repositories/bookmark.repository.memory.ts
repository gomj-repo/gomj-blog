import type { SavedBookmark } from '#shared/types/bookmark'
import type { IBookmarkRepository } from './bookmark.repository'

/** 인메모리 북마크 저장소. 개발·테스트 환경에서 사용한다. */
class InMemoryBookmarkRepository implements IBookmarkRepository {
  /** userId+pageId 복합 키 형태의 문자열을 키로 사용한다. */
  private readonly store = new Map<string, SavedBookmark>()

  private key(userId: string, pageId: string) {
    return `${userId}:${pageId}`
  }

  async addBookmark(userId: string, pageId: string): Promise<SavedBookmark> {
    const k = this.key(userId, pageId)
    const existing = this.store.get(k)
    if (existing) return existing

    const bookmark: SavedBookmark = {
      userId,
      pageId,
      createdAt: new Date().toISOString()
    }
    this.store.set(k, bookmark)
    return bookmark
  }

  async removeBookmark(userId: string, pageId: string): Promise<boolean> {
    const k = this.key(userId, pageId)
    return this.store.delete(k)
  }

  async listBookmarksByUser(userId: string): Promise<SavedBookmark[]> {
    return Array.from(this.store.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async isBookmarked(userId: string, pageId: string): Promise<boolean> {
    return this.store.has(this.key(userId, pageId))
  }
}

export const bookmarkRepository: IBookmarkRepository = new InMemoryBookmarkRepository()
