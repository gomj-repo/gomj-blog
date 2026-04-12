import { addTagToPageSchema } from '#shared/schemas/tag.schema'
import { tagRepository } from '../../../repositories'
import { requireAdmin } from '../../../utils/session'

/** POST /api/pages/:id/tags - 페이지에 태그를 연결한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }

  const body = await readBody(event)
  const input = addTagToPageSchema.parse(body)

  await tagRepository.addTagToPage(id, input.tagId)
  setResponseStatus(event, 201)
  return { pageId: id, tagId: input.tagId }
})
