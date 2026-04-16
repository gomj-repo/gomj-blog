import { updatePageSchema } from '#shared/schemas/page.schema'
import { pageRepository, pageVersionRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** PATCH /api/pages/:id - 페이지 정보를 수정한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Page ID is required' })
  }

  const body = await readBody(event)
  const input = updatePageSchema.parse(body)

  // 수정 전 현재 내용을 버전 스냅샷으로 저장한다.
  const existing = await pageRepository.getPage(id)
  if (existing && existing.content) {
    await pageVersionRepository.createVersion(id, existing.title, existing.content, existing.plainText)
  }

  const page = await pageRepository.updatePage(id, input)
  if (!page) {
    throw createError({ statusCode: 404, message: 'Page not found' })
  }

  return page
})
