import { createFolderSchema } from '#shared/schemas/folder.schema'
import { folderRepository } from '../../repositories'
import { requireAdmin } from '../../utils/session'

/** POST /api/folders - 새 폴더를 생성한다. 관리자 전용. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const input = createFolderSchema.parse(body)

  const folder = await folderRepository.createFolder(input)
  setResponseStatus(event, 201)
  return folder
})
