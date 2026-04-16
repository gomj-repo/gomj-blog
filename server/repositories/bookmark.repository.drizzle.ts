import { eq, and, desc } from 'drizzle-orm'
import type { SavedBookmark } from '#shared/types/bookmark'
import type { IBookmarkRepository } from './bookmark.repository'
import { getRequiredDb } from '../utils/db'
import { bookmarks } from '../database/schema/bookmarks'


/** Drizzle 행을 `SavedBookmark` 타입으로 변환한다. */
const toSavedBookmark = (row: typeof bookmarks.$inferSelect): SavedBookmark => ({
  userId: row.userId,
  pageId: row.pageId,
  createdAt: row.createdAt.toISOString()
})

/** Postgres 기반 북마크 저장소 구현체. */
class DrizzleBookmarkRepository implements IBookmarkRepository {
  /** 중복 북마크는 `onConflictDoNothing`으로 무시하고 기존 행을 반환한다. */
  async addBookmark(userId: string, pageId: string): Promise<SavedBookmark> {
    await getRequiredDb()
      .insert(bookmarks)
      .values({ userId, pageId })
      .onConflictDoNothing()

    const [row] = await getRequiredDb()
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.pageId, pageId)))
      .limit(1)

    if (!row) throw new Error('Failed to add bookmark')
    return toSavedBookmark(row)
  }

  async removeBookmark(userId: string, pageId: string): Promise<boolean> {
    const result = await getRequiredDb()
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.pageId, pageId)))
      .returning()

    return result.length > 0
  }

  async listBookmarksByUser(userId: string): Promise<SavedBookmark[]> {
    const rows = await getRequiredDb()
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))

    return rows.map(toSavedBookmark)
  }

  async isBookmarked(userId: string, pageId: string): Promise<boolean> {
    const [row] = await getRequiredDb()
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.pageId, pageId)))
      .limit(1)

    return !!row
  }
}

export const bookmarkRepository: IBookmarkRepository = new DrizzleBookmarkRepository()
