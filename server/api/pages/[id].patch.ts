import { updatePageSchema } from '#shared/schemas/page.schema'
import { pageRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'
import { snapshotCurrentVersion } from '../../utils/page-version'
import { requireParam } from '../../utils/params'

/** PATCH /api/pages/:id - 페이지 정보를 수정한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = requireParam(event, 'id')

  const body = await readBody(event)
  const input = updatePageSchema.parse(body)

  // 수정 전 현재 내용을 버전 스냅샷으로 저장한다.
  await snapshotCurrentVersion(id)

  const page = await pageRepository.updatePage(id, input)
  if (!page) {
    throw createError({ statusCode: 404, message: '페이지를 찾을 수 없습니다.' })
  }

  return page
})
