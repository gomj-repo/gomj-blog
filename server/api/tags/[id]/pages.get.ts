import { tagRepository } from '../../../repositories'
import { getSessionUser } from '../../../utils/session'

/** GET /api/tags/:id/pages - 특정 태그가 연결된 페이지 목록을 반환한다. 비로그인 시 공개만. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Tag ID is required' })
  }

  const user = await getSessionUser(event)
  const allPages = await tagRepository.getPagesByTag(id)

  if (user) return allPages
  return allPages.filter(p => p.isPublic)
})
