import { pageVersionRepository } from '../../../../repositories'

/** GET /api/pages/:id/versions - 특정 페이지의 버전 목록을 최신순으로 반환한다. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }

  const versions = await pageVersionRepository.listVersions(id)
  return versions
})
