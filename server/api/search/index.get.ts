import { searchRepository } from '../../repositories'
import { getSessionUser } from '../../utils/session'

/** GET /api/search?q= - 키워드로 페이지를 검색한다. 2자 이상 필요. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()

  if (q.length < 2) {
    throw createError({ statusCode: 400, message: '검색어는 2자 이상이어야 합니다.' })
  }

  const limit = Math.min(Number(query.limit) || 20, 50)
  const user = await getSessionUser(event)
  const includePrivate = !!user

  return searchRepository.searchPages(q, includePrivate, limit)
})
