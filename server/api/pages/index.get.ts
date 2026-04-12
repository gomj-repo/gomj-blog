import { pageRepository } from '../../repositories'
import { getSessionUser } from '../../utils/session'

/** GET /api/pages?folderId= - 폴더 내 페이지 목록을 반환한다. folderId 없으면 전체 페이지. 비로그인 시 공개 페이지만. */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const folderId = query.folderId as string | undefined
  const user = await getSessionUser(event)

  if (folderId) {
    const pages = await pageRepository.listPagesByFolder(folderId)
    if (user) return pages
    return pages.filter(p => p.isPublic)
  }

  // No folderId → return all pages (for sidebar tree)
  const pages = await pageRepository.listAllPages()
  if (user) return pages
  return pages.filter(p => p.isPublic)
})
