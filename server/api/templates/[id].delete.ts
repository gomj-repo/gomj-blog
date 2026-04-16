import { templateRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** DELETE /api/templates/:id - 템플릿을 삭제한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: '템플릿 ID가 필요합니다.' })

  const deleted = await templateRepository.deleteTemplate(id)
  if (!deleted) throw createError({ statusCode: 404, message: '템플릿을 찾을 수 없습니다.' })

  return { success: true }
})
