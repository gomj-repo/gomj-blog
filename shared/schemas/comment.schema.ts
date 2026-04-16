import { z } from 'zod'

/** 댓글 생성 요청 스키마. */
export const createCommentSchema = z.object({
  pageId: z.string().min(1),
  content: z.string().min(1),
  parentId: z.string().nullable().optional()
})

/** 댓글 수정 요청 스키마. 본문만 수정 가능하다. */
export const updateCommentSchema = z.object({
  content: z.string().min(1)
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
