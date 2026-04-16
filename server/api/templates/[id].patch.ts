import { updateTemplateSchema } from '#shared/schemas/template.schema'
import { templateRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'
import { requireParam } from '../../utils/params'

/** PATCH /api/templates/:id - 템플릿을 수정한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = requireParam(event, 'id')

  const body = await readBody(event)
  const input = updateTemplateSchema.parse(body)

  const template = await templateRepository.updateTemplate(id, input)
  if (!template) throw createError({ statusCode: 404, message: '템플릿을 찾을 수 없습니다.' })

  return template
})
