import { randomUUID } from 'node:crypto'
import { eq, asc } from 'drizzle-orm'
import type { ICommentRepository, SavedComment, CreateCommentWithUserInput } from './comment.repository'
import { db as _db } from '../utils/db'
import { comments } from '../database/schema/comments'

/** DB 연결이 없으면 에러를 던진다. */
function getDb() {
  if (!_db) throw new Error('DrizzleCommentRepository requires a database connection')
  return _db
}

/** Drizzle 행을 `SavedComment` 타입으로 변환한다. */
const toSavedComment = (row: typeof comments.$inferSelect): SavedComment => ({
  id: row.id,
  pageId: row.pageId,
  userId: row.userId,
  parentId: row.parentId,
  content: row.content,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
})

/** Postgres 기반 댓글 저장소 구현체. */
class DrizzleCommentRepository implements ICommentRepository {
  async createComment(input: CreateCommentWithUserInput): Promise<SavedComment> {
    const id = randomUUID()

    const [row] = await getDb()
      .insert(comments)
      .values({
        id,
        pageId: input.pageId,
        userId: input.userId,
        parentId: input.parentId ?? null,
        content: input.content
      })
      .returning()

    if (!row) throw new Error('Failed to create comment')
    return toSavedComment(row)
  }

  async getComment(id: string): Promise<SavedComment | null> {
    const [row] = await getDb()
      .select()
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1)

    return row ? toSavedComment(row) : null
  }

  async listCommentsByPage(pageId: string): Promise<SavedComment[]> {
    const rows = await getDb()
      .select()
      .from(comments)
      .where(eq(comments.pageId, pageId))
      .orderBy(asc(comments.createdAt))

    return rows.map(toSavedComment)
  }

  async updateComment(id: string, content: string): Promise<SavedComment | null> {
    const [row] = await getDb()
      .update(comments)
      .set({ content })
      .where(eq(comments.id, id))
      .returning()

    return row ? toSavedComment(row) : null
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await getDb()
      .delete(comments)
      .where(eq(comments.id, id))
      .returning()

    return result.length > 0
  }
}

export const commentRepository: ICommentRepository = new DrizzleCommentRepository()
