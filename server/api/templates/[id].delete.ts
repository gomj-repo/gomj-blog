import { templateRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'
import { requireParam } from '../../utils/params'

/** DELETE /api/templates/:id - 템플릿을 삭제한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = requireParam(event, 'id')

  const deleted = await templateRepository.deleteTemplate(id)
  if (!deleted) throw createError({ statusCode: 404, message: '템플릿을 찾을 수 없습니다.' })

  return { success: true }
})
