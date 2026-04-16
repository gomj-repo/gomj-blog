import { bookmarkRepository } from '../../repositories'
import { requireSession } from '../../utils/session'

/** GET /api/bookmarks - 현재 사용자의 북마크 목록을 반환한다. */
export default defineEventHandler(async (event) => {
  const user = await requireSession(event)
  return bookmarkRepository.listBookmarksByUser(user.userId)
})
