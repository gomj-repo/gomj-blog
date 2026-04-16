import { commentRepository } from '../../../../repositories'

/** GET /api/pages/:id/comments - 페이지의 댓글 목록을 반환한다. 공개 엔드포인트. */
export default defineEventHandler(async (event) => {
  const pageId = getRouterParam(event, 'id')
  if (!pageId) throw createError({ statusCode: 400, message: '페이지 ID가 필요합니다.' })

  return commentRepository.listCommentsByPage(pageId)
})
