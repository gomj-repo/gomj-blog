import type { SavedFolder } from '#shared/types/folder'

export const useFolderStore = () => {
  /** 전체 폴더 목록 (flat 배열). */
  const folders = useState<SavedFolder[]>('folders', () => [])
  /** 현재 선택된 폴더 ID. */
  const selectedFolderId = useState<string | null>('selected-folder-id', () => null)

  const setFolders = (value: SavedFolder[]) => {
    folders.value = value
  }

  const setSelectedFolderId = (id: string | null) => {
    selectedFolderId.value = id
  }

  return {
    folders,
    selectedFolderId,
    setFolders,
    setSelectedFolderId
  }
}
