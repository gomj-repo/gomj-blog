import { tagRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** DELETE /api/tags/:id - 태그를 삭제한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Tag ID is required' })
  }

  const deleted = await tagRepository.deleteTag(id)
  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Tag not found' })
  }

  setResponseStatus(event, 204)
  return null
})
