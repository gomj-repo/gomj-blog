import { updateCommentSchema } from '#shared/schemas/comment.schema'
import { commentRepository } from '../../../../repositories'
import { requireSession } from '../../../../utils/session'
import { requireParam } from '../../../../utils/params'

/** PATCH /api/pages/:id/comments/:commentId - 댓글 본문을 수정한다. 작성자 본인만 가능. */
export default defineEventHandler(async (event) => {
  const sessionUser = await requireSession(event)

  const commentId = requireParam(event, 'commentId')

  const existing = await commentRepository.getComment(commentId)
  if (!existing) throw createError({ statusCode: 404, message: '댓글을 찾을 수 없습니다.' })
  if (existing.userId !== sessionUser.userId) {
    throw createError({ statusCode: 403, message: '댓글을 수정할 권한이 없습니다.' })
  }

  const body = await readBody(event)
  const { content } = updateCommentSchema.parse(body)

  const updated = await commentRepository.updateComment(commentId, content)
  if (!updated) throw createError({ statusCode: 404, message: '댓글을 찾을 수 없습니다.' })
  return updated
})
