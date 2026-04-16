import type { SavedComment } from '#shared/types/comment'
import type { CreateCommentInput } from '#shared/schemas/comment.schema'

export type { SavedComment }

/** 댓글 생성 시 추가로 필요한 입력 타입. */
export type CreateCommentWithUserInput = CreateCommentInput & { userId: string }

/**
 * 댓글 저장소 인터페이스.
 * 구현체(InMemory, Drizzle)만 교체하면 저장 방식을 변경할 수 있다.
 */
export interface ICommentRepository {
  /** 새 댓글을 생성한다. */
  createComment(input: CreateCommentWithUserInput): Promise<SavedComment>
  /** ID로 댓글을 조회한다. */
  getComment(id: string): Promise<SavedComment | null>
  /** 특정 페이지의 댓글 목록을 생성순으로 반환한다. */
  listCommentsByPage(pageId: string): Promise<SavedComment[]>
  /** 댓글 본문을 수정한다. */
  updateComment(id: string, content: string): Promise<SavedComment | null>
  /** 댓글을 삭제한다. */
  deleteComment(id: string): Promise<boolean>
}
