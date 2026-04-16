import { randomUUID } from 'node:crypto'
import { eq, desc, max } from 'drizzle-orm'
import type { IPageVersionRepository, SavedPageVersion } from './page-version.repository'
import { db as _db } from '../utils/db'
import { pageVersions } from '../database/schema/page_versions'

/** DB 연결이 없으면 에러를 던진다. */
function getDb() {
  if (!_db) throw new Error('DrizzlePageVersionRepository requires a database connection')
  return _db
}

/** Drizzle 행을 `SavedPageVersion` 타입으로 변환한다. */
const toSavedPageVersion = (row: typeof pageVersions.$inferSelect): SavedPageVersion => ({
  id: row.id,
  pageId: row.pageId,
  versionNumber: row.versionNumber,
  title: row.title,
  content: row.content as Record<string, unknown> | null,
  plainText: row.plainText,
  createdAt: row.createdAt.toISOString()
})

/** Postgres 기반 페이지 버전 저장소 구현체. */
class DrizzlePageVersionRepository implements IPageVersionRepository {
  async createVersion(pageId: string, title: string, content: unknown, plainText: string | null): Promise<SavedPageVersion> {
    const id = randomUUID()
    const versionNumber = (await this.getLatestVersionNumber(pageId)) + 1

    const [row] = await getDb()
      .insert(pageVersions)
      .values({
        id,
        pageId,
        versionNumber,
        title,
        content: content ?? null,
        plainText
      })
      .returning()

    if (!row) throw new Error('Failed to create page version')
    return toSavedPageVersion(row)
  }

  async listVersions(pageId: string): Promise<SavedPageVersion[]> {
    const rows = await getDb()
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.pageId, pageId))
      .orderBy(desc(pageVersions.versionNumber))

    return rows.map(toSavedPageVersion)
  }

  async getVersion(id: string): Promise<SavedPageVersion | null> {
    const [row] = await getDb()
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.id, id))
      .limit(1)

    return row ? toSavedPageVersion(row) : null
  }

  async getLatestVersionNumber(pageId: string): Promise<number> {
    const [result] = await getDb()
      .select({ maxVersion: max(pageVersions.versionNumber) })
      .from(pageVersions)
      .where(eq(pageVersions.pageId, pageId))

    return result?.maxVersion ?? 0
  }
}

export const pageVersionRepository: IPageVersionRepository = new DrizzlePageVersionRepository()
