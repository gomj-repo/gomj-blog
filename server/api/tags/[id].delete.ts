import { tagRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'
import { requireParam } from '../../utils/params'

/** DELETE /api/tags/:id - 태그를 삭제한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = requireParam(event, 'id')

  const deleted = await tagRepository.deleteTag(id)
  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Tag not found' })
  }

  setResponseStatus(event, 204)
  return null
})
