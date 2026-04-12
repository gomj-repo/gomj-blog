import { createPageSchema } from '#shared/schemas/page.schema'
import { pageRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** POST /api/pages - 새 페이지를 생성한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const input = createPageSchema.parse(body)

  const page = await pageRepository.createPage(input)
  setResponseStatus(event, 201)
  return page
})
