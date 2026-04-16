import { bookmarkRepository } from '../../repositories'
import { requireSession } from '../../utils/session'
import { requireParam } from '../../utils/params'

/** POST /api/bookmarks/:pageId - 페이지를 북마크에 추가한다. */
export default defineEventHandler(async (event) => {
  const user = await requireSession(event)

  const pageId = requireParam(event, 'pageId')

  const bookmark = await bookmarkRepository.addBookmark(user.userId, pageId)
  setResponseStatus(event, 201)
  return bookmark
})
