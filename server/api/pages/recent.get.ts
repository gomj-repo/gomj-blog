import { pageRepository } from '../../repositories'

/** GET /api/pages/recent - 최근 공개 페이지를 반환한다. 최대 50건. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 10, 50)

  return pageRepository.listPublicPages(limit)
})
