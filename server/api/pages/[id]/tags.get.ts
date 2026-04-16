import { tagRepository } from '../../../repositories'
import { requireParam } from '../../../utils/params'

/** GET /api/pages/:id/tags - 페이지에 연결된 태그 목록을 반환한다. */
export default defineEventHandler(async (event) => {
  const id = requireParam(event, 'id')

  return tagRepository.getTagsByPage(id)
})
