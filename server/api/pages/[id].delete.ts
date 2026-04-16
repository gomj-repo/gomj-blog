import { pageRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'
import { requireParam } from '../../utils/params'

/** DELETE /api/pages/:id - 페이지를 삭제한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = requireParam(event, 'id')

  const deleted = await pageRepository.deletePage(id)
  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Page not found' })
  }

  setResponseStatus(event, 204)
  return null
})
