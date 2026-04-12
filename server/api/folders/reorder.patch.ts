import { z } from 'zod'
import { folderRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** PATCH /api/folders/reorder - 같은 부모 아래 폴더 정렬 순서를 변경한다. 관리자 전용. */
const reorderSchema = z.object({
  parentId: z.string().nullable(),
  orderedIds: z.array(z.string().min(1)).min(1)
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { parentId, orderedIds } = reorderSchema.parse(body)

  await folderRepository.reorderFolders(parentId, orderedIds)
  setResponseStatus(event, 204)
  return null
})
