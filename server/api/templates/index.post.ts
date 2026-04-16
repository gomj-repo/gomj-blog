import { createTemplateSchema } from '#shared/schemas/template.schema'
import { templateRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** POST /api/templates - 새 템플릿을 생성한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const input = createTemplateSchema.parse(body)

  const template = await templateRepository.createTemplate(input)
  setResponseStatus(event, 201)
  return template
})
