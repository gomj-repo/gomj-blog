import { bookmarkRepository } from '../../repositories'
import { requireSession } from '../../utils/session'
import { requireParam } from '../../utils/params'

/** DELETE /api/bookmarks/:pageId - 페이지를 북마크에서 제거한다. */
export default defineEventHandler(async (event) => {
  const user = await requireSession(event)

  const pageId = requireParam(event, 'pageId')

  const removed = await bookmarkRepository.removeBookmark(user.userId, pageId)
  if (!removed) throw createError({ statusCode: 404, message: '해당 북마크를 찾을 수 없습니다.' })

  return { success: true }
})
