import { randomUUID } from 'node:crypto'
import { eq, and, asc, desc } from 'drizzle-orm'
import type { CreatePageInput, UpdatePageInput } from '#shared/schemas/page.schema'
import type { IPageRepository, SavedPage } from './page.repository'
import { db as _db } from '../utils/db'
import { pages } from '../database/schema/pages'
import { extractPlainText } from '../utils/tiptap'

/** DB 연결이 없으면 에러를 던진다. */
function getDb() {
  if (!_db) throw new Error('DrizzlePageRepository requires a database connection')
  return _db
}

/** Drizzle 행을 `SavedPage` 타입으로 변환한다. */
const toSavedPage = (row: typeof pages.$inferSelect): SavedPage => ({
  id: row.id,
  folderId: row.folderId,
  parentPageId: null,
  title: row.title,
  slug: row.slug,
  content: row.content as Record<string, unknown> | null,
  plainText: row.plainText,
  isPublic: row.isPublic,
  status: row.status,
  sortOrder: row.sortOrder,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
})

/** 제목을 URL-safe 슬러그로 변환한다. 변환 결과가 비어 있으면 UUID 앞 8자를 사용한다. */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || randomUUID().slice(0, 8)
}

/** Postgres 기반 페이지 저장소 구현체. */
class DrizzlePageRepository implements IPageRepository {
  async createPage(input: CreatePageInput): Promise<SavedPage> {
    const id = randomUUID()
    const content = input.content ?? null
    const plainText = extractPlainText(content as Record<string, unknown> | null)

    const [row] = await getDb()
      .insert(pages)
      .values({
        id,
        folderId: input.folderId,
        title: input.title,
        slug: input.slug || generateSlug(input.title),
        content,
        plainText: plainText || null,
        isPublic: input.isPublic ?? true,
        status: input.status ?? 'published',
        sortOrder: input.sortOrder ?? 0
      })
      .returning()

    if (!row) throw new Error('Failed to create page')
    return toSavedPage(row)
  }

  async getPage(id: string): Promise<SavedPage | null> {
    const [row] = await getDb()
      .select()
      .from(pages)
      .where(eq(pages.id, id))
      .limit(1)

    return row ? toSavedPage(row) : null
  }

  async getPageBySlug(folderId: string, slug: string): Promise<SavedPage | null> {
    const [row] = await getDb()
      .select()
      .from(pages)
      .where(and(eq(pages.folderId, folderId), eq(pages.slug, slug)))
      .limit(1)

    return row ? toSavedPage(row) : null
  }

  async listAllPages(): Promise<SavedPage[]> {
    const rows = await getDb()
      .select()
      .from(pages)
      .orderBy(asc(pages.sortOrder), asc(pages.title))

    return rows.map(toSavedPage)
  }

  async listPagesByFolder(folderId: string): Promise<SavedPage[]> {
    const rows = await getDb()
      .select()
      .from(pages)
      .where(eq(pages.folderId, folderId))
      .orderBy(asc(pages.sortOrder), asc(pages.title))

    return rows.map(toSavedPage)
  }

  async listPublicPages(limit = 10): Promise<SavedPage[]> {
    const rows = await getDb()
      .select()
      .from(pages)
      .where(eq(pages.isPublic, true))
      .orderBy(desc(pages.createdAt))
      .limit(limit)

    return rows.map(toSavedPage)
  }

  async updatePage(id: string, input: Partial<UpdatePageInput>): Promise<SavedPage | null> {
    const values: Partial<typeof pages.$inferInsert> = {}
    if (input.folderId !== undefined) values.folderId = input.folderId
    if (input.title !== undefined) values.title = input.title
    if (input.slug !== undefined) values.slug = input.slug
    if (input.content !== undefined) {
      values.content = input.content
      values.plainText = extractPlainText(input.content as Record<string, unknown> | null) || null
    }
    if (input.isPublic !== undefined) values.isPublic = input.isPublic
    if (input.status !== undefined) values.status = input.status
    if (input.sortOrder !== undefined) values.sortOrder = input.sortOrder

    const [row] = await getDb()
      .update(pages)
      .set(values)
      .where(eq(pages.id, id))
      .returning()

    return row ? toSavedPage(row) : null
  }

  async deletePage(id: string): Promise<boolean> {
    const result = await getDb()
      .delete(pages)
      .where(eq(pages.id, id))
      .returning()

    return result.length > 0
  }

  async reorderPages(folderId: string, orderedIds: string[]): Promise<void> {
    const db = getDb()
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(pages)
        .set({ sortOrder: i })
        .where(eq(pages.id, orderedIds[i]!))
    }
  }
}

export const pageRepository: IPageRepository = new DrizzlePageRepository()
