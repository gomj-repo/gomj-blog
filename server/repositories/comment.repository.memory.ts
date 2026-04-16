import { randomUUID } from 'uncrypto'
import type { ICommentRepository, SavedComment, CreateCommentWithUserInput } from './comment.repository'

/** 인메모리 댓글 저장소. 개발·테스트 환경에서 DB 없이 동작한다. */
class InMemoryCommentRepository implements ICommentRepository {
  private readonly comments = new Map<string, SavedComment>()

  async createComment(input: CreateCommentWithUserInput): Promise<SavedComment> {
    const now = new Date().toISOString()
    const comment: SavedComment = {
      id: randomUUID(),
      pageId: input.pageId,
      userId: input.userId,
      parentId: input.parentId ?? null,
      content: input.content,
      createdAt: now,
      updatedAt: now
    }
    this.comments.set(comment.id, comment)
    return comment
  }

  async getComment(id: string): Promise<SavedComment | null> {
    return this.comments.get(id) ?? null
  }

  async listCommentsByPage(pageId: string): Promise<SavedComment[]> {
    return Array.from(this.comments.values())
      .filter(c => c.pageId === pageId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  async updateComment(id: string, content: string): Promise<SavedComment | null> {
    const comment = this.comments.get(id)
    if (!comment) return null
    const updated: SavedComment = { ...comment, content, updatedAt: new Date().toISOString() }
    this.comments.set(id, updated)
    return updated
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.comments.delete(id)
  }
}

export const commentRepository: ICommentRepository = new InMemoryCommentRepository()
