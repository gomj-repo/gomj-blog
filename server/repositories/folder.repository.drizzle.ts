import { randomUUID } from 'node:crypto'
import { eq, isNull, asc } from 'drizzle-orm'
import type { CreateFolderInput, UpdateFolderInput } from '#shared/schemas/folder.schema'
import type { IFolderRepository, SavedFolder } from './folder.repository'
import { getRequiredDb } from '../utils/db'
import { folders } from '../database/schema/folders'


/** Drizzle 행을 `SavedFolder` 타입으로 변환한다. */
const toSavedFolder = (row: typeof folders.$inferSelect): SavedFolder => ({
  id: row.id,
  parentId: row.parentId,
  name: row.name,
  slug: row.slug,
  sortOrder: row.sortOrder,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
})

/** Postgres 기반 폴더 저장소 구현체. */
class DrizzleFolderRepository implements IFolderRepository {
  async createFolder(input: CreateFolderInput): Promise<SavedFolder> {
    const id = randomUUID()
    const [row] = await getRequiredDb()
      .insert(folders)
      .values({
        id,
        parentId: input.parentId ?? null,
        name: input.name,
        slug: input.slug,
        sortOrder: input.sortOrder ?? 0
      })
      .returning()

    if (!row) throw new Error('Failed to create folder')
    return toSavedFolder(row)
  }

  async getFolder(id: string): Promise<SavedFolder | null> {
    const [row] = await getRequiredDb()
      .select()
      .from(folders)
      .where(eq(folders.id, id))
      .limit(1)

    return row ? toSavedFolder(row) : null
  }

  async getFolderBySlug(parentId: string | null, slug: string): Promise<SavedFolder | null> {
    const condition = parentId
      ? eq(folders.parentId, parentId)
      : isNull(folders.parentId)

    const rows = await getRequiredDb()
      .select()
      .from(folders)
      .where(condition)
      .limit(100)

    const row = rows.find(r => r.slug === slug)
    return row ? toSavedFolder(row) : null
  }

  async listFolders(): Promise<SavedFolder[]> {
    const rows = await getRequiredDb()
      .select()
      .from(folders)
      .orderBy(asc(folders.sortOrder), asc(folders.name))

    return rows.map(toSavedFolder)
  }

  async listChildFolders(parentId: string | null): Promise<SavedFolder[]> {
    const condition = parentId
      ? eq(folders.parentId, parentId)
      : isNull(folders.parentId)

    const rows = await getRequiredDb()
      .select()
      .from(folders)
      .where(condition)
      .orderBy(asc(folders.sortOrder), asc(folders.name))

    return rows.map(toSavedFolder)
  }

  async updateFolder(id: string, input: Partial<UpdateFolderInput>): Promise<SavedFolder | null> {
    const values: Partial<typeof folders.$inferInsert> = {}
    if (input.parentId !== undefined) values.parentId = input.parentId ?? null
    if (input.name !== undefined) values.name = input.name
    if (input.slug !== undefined) values.slug = input.slug
    if (input.sortOrder !== undefined) values.sortOrder = input.sortOrder

    const [row] = await getRequiredDb()
      .update(folders)
      .set(values)
      .where(eq(folders.id, id))
      .returning()

    return row ? toSavedFolder(row) : null
  }

  async deleteFolder(id: string): Promise<boolean> {
    const result = await getRequiredDb()
      .delete(folders)
      .where(eq(folders.id, id))
      .returning()

    return result.length > 0
  }

  async reorderFolders(parentId: string | null, orderedIds: string[]): Promise<void> {
    const db = getRequiredDb()
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(folders)
        .set({ sortOrder: i })
        .where(eq(folders.id, orderedIds[i]!))
    }
  }
}

export const folderRepository: IFolderRepository = new DrizzleFolderRepository()
