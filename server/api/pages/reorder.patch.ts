import { z } from 'zod'
import { pageRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** PATCH /api/pages/reorder - 폴더 내 페이지 정렬 순서를 변경한다. 관리자 전용. */
const reorderSchema = z.object({
  folderId: z.string().min(1),
  orderedIds: z.array(z.string().min(1)).min(1)
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { folderId, orderedIds } = reorderSchema.parse(body)

  await pageRepository.reorderPages(folderId, orderedIds)
  setResponseStatus(event, 204)
  return null
})
