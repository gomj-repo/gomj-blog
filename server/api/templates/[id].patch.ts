import { updateTemplateSchema } from '#shared/schemas/template.schema'
import { templateRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** PATCH /api/templates/:id - 템플릿을 수정한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: '템플릿 ID가 필요합니다.' })

  const body = await readBody(event)
  const input = updateTemplateSchema.parse(body)

  const template = await templateRepository.updateTemplate(id, input)
  if (!template) throw createError({ statusCode: 404, message: '템플릿을 찾을 수 없습니다.' })

  return template
})
