import { templateRepository } from '../../repositories'

/** GET /api/templates/:id - 특정 템플릿을 조회한다. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: '템플릿 ID가 필요합니다.' })

  const template = await templateRepository.getTemplate(id)
  if (!template) throw createError({ statusCode: 404, message: '템플릿을 찾을 수 없습니다.' })

  return template
})
