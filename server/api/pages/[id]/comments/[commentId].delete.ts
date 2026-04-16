import { commentRepository } from '../../../../repositories'
import { requireSession, requireAdmin } from '../../../../utils/session'
import { requireParam } from '../../../../utils/params'

/** DELETE /api/pages/:id/comments/:commentId - 댓글을 삭제한다. 작성자 본인 또는 관리자만 가능. */
export default defineEventHandler(async (event) => {
  const sessionUser = await requireSession(event)

  const commentId = requireParam(event, 'commentId')

  const existing = await commentRepository.getComment(commentId)
  if (!existing) throw createError({ statusCode: 404, message: '댓글을 찾을 수 없습니다.' })

  const isOwner = existing.userId === sessionUser.userId
  if (!isOwner) {
    // 본인이 아닌 경우 관리자 권한을 확인한다.
    await requireAdmin(event)
  }

  const deleted = await commentRepository.deleteComment(commentId)
  if (!deleted) throw createError({ statusCode: 404, message: '댓글을 찾을 수 없습니다.' })
  return { success: true }
})
