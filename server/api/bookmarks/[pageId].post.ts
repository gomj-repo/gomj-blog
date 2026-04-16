import { bookmarkRepository } from '../../repositories'
import { requireSession } from '../../utils/session'

/** POST /api/bookmarks/:pageId - 페이지를 북마크에 추가한다. */
export default defineEventHandler(async (event) => {
  const user = await requireSession(event)

  const pageId = getRouterParam(event, 'pageId')
  if (!pageId) throw createError({ statusCode: 400, message: '페이지 ID가 필요합니다.' })

  const bookmark = await bookmarkRepository.addBookmark(user.userId, pageId)
  setResponseStatus(event, 201)
  return bookmark
})
