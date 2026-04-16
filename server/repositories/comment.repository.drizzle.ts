import { randomUUID } from 'node:crypto'
import { eq, asc } from 'drizzle-orm'
import type { ICommentRepository, SavedComment, CreateCommentWithUserInput } from './comment.repository'
import { getRequiredDb } from '../utils/db'
import { comments } from '../database/schema/comments'


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

    const [row] = await getRequiredDb()
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
    const [row] = await getRequiredDb()
      .select()
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1)

    return row ? toSavedComment(row) : null
  }

  async listCommentsByPage(pageId: string): Promise<SavedComment[]> {
    const rows = await getRequiredDb()
      .select()
      .from(comments)
      .where(eq(comments.pageId, pageId))
      .orderBy(asc(comments.createdAt))

    return rows.map(toSavedComment)
  }

  async updateComment(id: string, content: string): Promise<SavedComment | null> {
    const [row] = await getRequiredDb()
      .update(comments)
      .set({ content })
      .where(eq(comments.id, id))
      .returning()

    return row ? toSavedComment(row) : null
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await getRequiredDb()
      .delete(comments)
      .where(eq(comments.id, id))
      .returning()

    return result.length > 0
  }
}

export const commentRepository: ICommentRepository = new DrizzleCommentRepository()
