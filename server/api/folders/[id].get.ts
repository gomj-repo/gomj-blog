import { folderRepository } from '../../repositories'

/** GET /api/folders/:id - ID로 폴더를 조회한다. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Folder ID is required' })
  }

  const folder = await folderRepository.getFolder(id)
  if (!folder) {
    throw createError({ statusCode: 404, message: 'Folder not found' })
  }

  return folder
})
