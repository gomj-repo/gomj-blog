import { pageRepository, pageVersionRepository } from '../../../../../repositories'
import { requireAdmin } from '../../../../../utils/session'

/** POST /api/pages/:id/versions/:versionId/restore - 특정 버전으로 페이지를 복원한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const versionId = getRouterParam(event, 'versionId')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }
  if (!versionId) {
    throw createError({ statusCode: 400, message: 'Version ID is required' })
  }

  const version = await pageVersionRepository.getVersion(versionId)
  if (!version || version.pageId !== id) {
    throw createError({ statusCode: 404, message: 'Version not found' })
  }

  // 복원 전 현재 내용을 버전 스냅샷으로 저장한다.
  const existing = await pageRepository.getPage(id)
  if (existing && existing.content) {
    await pageVersionRepository.createVersion(id, existing.title, existing.content, existing.plainText)
  }

  const page = await pageRepository.updatePage(id, {
    title: version.title,
    content: version.content ?? undefined
  })

  if (!page) {
    throw createError({ statusCode: 404, message: 'Page not found' })
  }

  return page
})
