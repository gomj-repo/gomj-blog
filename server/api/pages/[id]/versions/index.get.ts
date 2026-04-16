import { pageVersionRepository } from '../../../../repositories'
import { requireParam } from '../../../../utils/params'

/** GET /api/pages/:id/versions - 특정 페이지의 버전 목록을 최신순으로 반환한다. */
export default defineEventHandler(async (event) => {
  const id = requireParam(event, 'id')

  const versions = await pageVersionRepository.listVersions(id)
  return versions
})
