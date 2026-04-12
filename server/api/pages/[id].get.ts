import { pageRepository } from '../../repositories'
import { getSessionUser } from '../../utils/session'

/** GET /api/pages/:id - 페이지를 조회한다. 비공개 페이지는 관리자만 접근 가능. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }

  const page = await pageRepository.getPage(id)
  if (!page) {
    throw createError({ statusCode: 404, message: 'Page not found' })
  }

  const user = await getSessionUser(event)
  if (!page.isPublic && !user) {
    throw createError({ statusCode: 404, message: 'Page not found' })
  }

  return page
})
