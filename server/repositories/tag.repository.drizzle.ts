import { randomUUID } from 'node:crypto'
import { eq, and, asc } from 'drizzle-orm'
import type { CreateTagInput } from '#shared/schemas/tag.schema'
import type { SavedTag } from '#shared/types/tag'
import type { SavedPage } from '#shared/types/page'
import type { ITagRepository } from './tag.repository'
import { getRequiredDb } from '../utils/db'
import { tags } from '../database/schema/tags'
import { pageTags } from '../database/schema/tags'
import { pages } from '../database/schema/pages'


/** Drizzle 행을 `SavedTag` 타입으로 변환한다. */
const toSavedTag = (row: typeof tags.$inferSelect): SavedTag => ({
  id: row.id,
  name: row.name,
  createdAt: row.createdAt.toISOString()
})

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
  sortOrder: row.sortOrder,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
})

/** Postgres 기반 태그 저장소 구현체. */
class DrizzleTagRepository implements ITagRepository {
  async createTag(input: CreateTagInput): Promise<SavedTag> {
    const id = randomUUID()
    const [row] = await getRequiredDb()
      .insert(tags)
      .values({ id, name: input.name })
      .returning()

    if (!row) throw new Error('Failed to create tag')
    return toSavedTag(row)
  }

  async getTag(id: string): Promise<SavedTag | null> {
    const [row] = await getRequiredDb()
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1)

    return row ? toSavedTag(row) : null
  }

  async getTagByName(name: string): Promise<SavedTag | null> {
    const [row] = await getRequiredDb()
      .select()
      .from(tags)
      .where(eq(tags.name, name))
      .limit(1)

    return row ? toSavedTag(row) : null
  }

  async listTags(): Promise<SavedTag[]> {
    const rows = await getRequiredDb()
      .select()
      .from(tags)
      .orderBy(asc(tags.name))

    return rows.map(toSavedTag)
  }

  async deleteTag(id: string): Promise<boolean> {
    const result = await getRequiredDb()
      .delete(tags)
      .where(eq(tags.id, id))
      .returning()

    return result.length > 0
  }

  /** 중복 연결은 `onConflictDoNothing`으로 무시한다. */
  async addTagToPage(pageId: string, tagId: string): Promise<void> {
    await getRequiredDb()
      .insert(pageTags)
      .values({ pageId, tagId })
      .onConflictDoNothing()
  }

  async removeTagFromPage(pageId: string, tagId: string): Promise<boolean> {
    const result = await getRequiredDb()
      .delete(pageTags)
      .where(and(eq(pageTags.pageId, pageId), eq(pageTags.tagId, tagId)))
      .returning()

    return result.length > 0
  }

  /** `pageTags` JOIN `tags`로 특정 페이지의 태그를 조회한다. */
  async getTagsByPage(pageId: string): Promise<SavedTag[]> {
    const rows = await getRequiredDb()
      .select({
        id: tags.id,
        name: tags.name,
        createdAt: tags.createdAt
      })
      .from(pageTags)
      .innerJoin(tags, eq(pageTags.tagId, tags.id))
      .where(eq(pageTags.pageId, pageId))
      .orderBy(asc(tags.name))

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString()
    }))
  }

  /** `pageTags` JOIN `pages`로 특정 태그의 페이지를 조회한다. */
  async getPagesByTag(tagId: string): Promise<SavedPage[]> {
    const rows = await getRequiredDb()
      .select({
        id: pages.id,
        folderId: pages.folderId,
        title: pages.title,
        slug: pages.slug,
        content: pages.content,
        plainText: pages.plainText,
        isPublic: pages.isPublic,
        sortOrder: pages.sortOrder,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt
      })
      .from(pageTags)
      .innerJoin(pages, eq(pageTags.pageId, pages.id))
      .where(eq(pageTags.tagId, tagId))
      .orderBy(asc(pages.title))

    return rows.map(row => toSavedPage(row as typeof pages.$inferSelect))
  }
}

export const tagRepository: ITagRepository = new DrizzleTagRepository()
