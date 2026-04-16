import { folderRepository } from '../../repositories'
import { requireParam } from '../../utils/params'

/** GET /api/folders/:id - ID로 폴더를 조회한다. */
export default defineEventHandler(async (event) => {
  const id = requireParam(event, 'id')

  const folder = await folderRepository.getFolder(id)
  if (!folder) {
    throw createError({ statusCode: 404, message: 'Folder not found' })
  }

  return folder
})
