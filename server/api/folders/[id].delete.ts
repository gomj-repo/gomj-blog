import { folderRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** DELETE /api/folders/:id - 폴더를 삭제한다. 하위 폴더·페이지도 함께 제거. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Folder ID is required' })
  }

  const deleted = await folderRepository.deleteFolder(id)
  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Folder not found' })
  }

  setResponseStatus(event, 204)
  return null
})
