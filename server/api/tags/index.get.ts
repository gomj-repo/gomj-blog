import { tagRepository } from '../../repositories'

/** GET /api/tags - 전체 태그 목록을 반환한다. */
export default defineEventHandler(async () => {
  return tagRepository.listTags()
})
