import { createCommentSchema } from '#shared/schemas/comment.schema'
import { commentRepository } from '../../../../repositories'
import { requireSession } from '../../../../utils/session'
import { requireParam } from '../../../../utils/params'

/** POST /api/pages/:id/comments - 댓글을 생성한다. 로그인한 사용자만 가능. */
export default defineEventHandler(async (event) => {
  const sessionUser = await requireSession(event)

  const pageId = requireParam(event, 'id')

  const body = await readBody(event)
  const input = createCommentSchema.parse({ ...body, pageId })

  const comment = await commentRepository.createComment({ ...input, userId: sessionUser.userId })
  setResponseStatus(event, 201)
  return comment
})
