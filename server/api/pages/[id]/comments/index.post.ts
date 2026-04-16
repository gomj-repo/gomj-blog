import { createCommentSchema } from '#shared/schemas/comment.schema'
import { commentRepository } from '../../../../repositories'
import { requireSession } from '../../../../utils/session'

/** POST /api/pages/:id/comments - 댓글을 생성한다. 로그인한 사용자만 가능. */
export default defineEventHandler(async (event) => {
  const sessionUser = await requireSession(event)

  const pageId = getRouterParam(event, 'id')
  if (!pageId) throw createError({ statusCode: 400, message: '페이지 ID가 필요합니다.' })

  const body = await readBody(event)
  const input = createCommentSchema.parse({ ...body, pageId })

  const comment = await commentRepository.createComment({ ...input, userId: sessionUser.userId })
  setResponseStatus(event, 201)
  return comment
})
