import { folderRepository } from '../../repositories'

/** GET /api/folders - 전체 폴더 목록을 반환한다. */
export default defineEventHandler(async () => {
  return folderRepository.listFolders()
})
