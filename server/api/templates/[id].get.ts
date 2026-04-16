import { templateRepository } from '../../repositories'
import { requireParam } from '../../utils/params'

/** GET /api/templates/:id - 특정 템플릿을 조회한다. */
export default defineEventHandler(async (event) => {
  const id = requireParam(event, 'id')

  const template = await templateRepository.getTemplate(id)
  if (!template) throw createError({ statusCode: 404, message: '템플릿을 찾을 수 없습니다.' })

  return template
})
