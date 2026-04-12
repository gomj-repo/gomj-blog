import { tagRepository } from '../../../../repositories'
import { requireAdmin } from '../../../../utils/session'

/** DELETE /api/pages/:id/tags/:tagId - 페이지에서 태그 연결을 해제한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const tagId = getRouterParam(event, 'tagId')

  if (!id || !tagId) {
    throw createError({ statusCode: 400, message: 'Page ID and Tag ID are required' })
  }

  const removed = await tagRepository.removeTagFromPage(id, tagId)
  if (!removed) {
    throw createError({ statusCode: 404, message: 'Page-tag association not found' })
  }

  setResponseStatus(event, 204)
  return null
})
