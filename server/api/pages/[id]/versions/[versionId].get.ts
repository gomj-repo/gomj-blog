import { pageVersionRepository } from '../../../../repositories'

/** GET /api/pages/:id/versions/:versionId - 특정 버전을 조회한다. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const versionId = getRouterParam(event, 'versionId')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }
  if (!versionId) {
    throw createError({ statusCode: 400, message: 'Version ID is required' })
  }

  const version = await pageVersionRepository.getVersion(versionId)
  if (!version || version.pageId !== id) {
    throw createError({ statusCode: 404, message: 'Version not found' })
  }

  return version
})
