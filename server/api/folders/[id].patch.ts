import { updateFolderSchema } from '#shared/schemas/folder.schema'
import { folderRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** PATCH /api/folders/:id - 폴더 정보를 수정한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Folder ID is required' })
  }

  const body = await readBody(event)
  const input = updateFolderSchema.parse(body)

  const folder = await folderRepository.updateFolder(id, input)
  if (!folder) {
    throw createError({ statusCode: 404, message: 'Folder not found' })
  }

  return folder
})
