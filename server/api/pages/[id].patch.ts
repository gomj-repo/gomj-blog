import { updatePageSchema } from '#shared/schemas/page.schema'
import { pageRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** PATCH /api/pages/:id - 페이지 정보를 수정한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }

  const body = await readBody(event)
  const input = updatePageSchema.parse(body)

  const page = await pageRepository.updatePage(id, input)
  if (!page) {
    throw createError({ statusCode: 404, message: 'Page not found' })
  }

  return page
})
