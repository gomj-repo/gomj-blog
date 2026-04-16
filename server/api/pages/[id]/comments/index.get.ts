import { commentRepository } from '../../../../repositories'
import { requireParam } from '../../../../utils/params'

/** GET /api/pages/:id/comments - 페이지의 댓글 목록을 반환한다. 공개 엔드포인트. */
export default defineEventHandler(async (event) => {
  const pageId = requireParam(event, 'id')

  return commentRepository.listCommentsByPage(pageId)
})
