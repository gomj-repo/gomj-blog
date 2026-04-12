import { tagRepository } from '../../../repositories'

/** GET /api/pages/:id/tags - 페이지에 연결된 태그 목록을 반환한다. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }

  return tagRepository.getTagsByPage(id)
})
