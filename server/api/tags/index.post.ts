import { createTagSchema } from '#shared/schemas/tag.schema'
import { tagRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** POST /api/tags - 새 태그를 생성한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const input = createTagSchema.parse(body)

  const tag = await tagRepository.createTag(input)
  setResponseStatus(event, 201)
  return tag
})
