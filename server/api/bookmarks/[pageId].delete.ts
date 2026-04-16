import { bookmarkRepository } from '../../repositories'
import { requireSession } from '../../utils/session'

/** DELETE /api/bookmarks/:pageId - 페이지를 북마크에서 제거한다. */
export default defineEventHandler(async (event) => {
  const user = await requireSession(event)

  const pageId = getRouterParam(event, 'pageId')
  if (!pageId) throw createError({ statusCode: 400, message: '페이지 ID가 필요합니다.' })

  const removed = await bookmarkRepository.removeBookmark(user.userId, pageId)
  if (!removed) throw createError({ statusCode: 404, message: '해당 북마크를 찾을 수 없습니다.' })

  return { success: true }
})
