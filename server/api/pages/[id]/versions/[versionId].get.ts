import { pageVersionRepository } from '../../../../repositories'
import { requireParam } from '../../../../utils/params'

/** GET /api/pages/:id/versions/:versionId - 특정 버전을 조회한다. */
export default defineEventHandler(async (event) => {
  const id = requireParam(event, 'id')
  const versionId = requireParam(event, 'versionId')

  const version = await pageVersionRepository.getVersion(versionId)
  if (!version || version.pageId !== id) {
    throw createError({ statusCode: 404, message: '버전을 찾을 수 없습니다.' })
  }

  return version
})
