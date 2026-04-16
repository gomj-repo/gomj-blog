import { pageRepository, pageVersionRepository } from '../../../../../repositories'
import { requireAdmin } from '../../../../../utils/session'
import { snapshotCurrentVersion } from '../../../../../utils/page-version'
import { requireParam } from '../../../../../utils/params'

/** POST /api/pages/:id/versions/:versionId/restore - 특정 버전으로 페이지를 복원한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = requireParam(event, 'id')
  const versionId = requireParam(event, 'versionId')

  const version = await pageVersionRepository.getVersion(versionId)
  if (!version || version.pageId !== id) {
    throw createError({ statusCode: 404, message: '버전을 찾을 수 없습니다.' })
  }

  // 복원 전 현재 내용을 버전 스냅샷으로 저장한다.
  await snapshotCurrentVersion(id)

  const page = await pageRepository.updatePage(id, {
    title: version.title,
    content: version.content ?? undefined
  })

  if (!page) {
    throw createError({ statusCode: 404, message: '페이지를 찾을 수 없습니다.' })
  }

  return page
})
