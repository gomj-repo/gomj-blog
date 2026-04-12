import type { SavedFolder } from '#shared/types/folder'
import type { CreateFolderInput, UpdateFolderInput } from '#shared/schemas/folder.schema'
import { useFolderStore } from '~/composables/store/useFolderStore'

export const useFolderApi = () => {
  const store = useFolderStore()

  /** 전체 폴더 목록을 가져와 스토어에 반영한다. */
  const fetchFolders = async () => {
    const data = await $fetch<SavedFolder[]>('/api/folders')
    store.setFolders(data)
    return data
  }

  /** 새 폴더를 생성하고 목록을 갱신한다. */
  const createFolder = async (input: CreateFolderInput) => {
    const folder = await $fetch<SavedFolder>('/api/folders', {
      method: 'POST',
      body: input
    })
    await fetchFolders()
    return folder
  }

  /** 폴더 정보를 수정하고 목록을 갱신한다. */
  const updateFolder = async (id: string, input: Partial<UpdateFolderInput>) => {
    const folder = await $fetch<SavedFolder>(`/api/folders/${id}`, {
      method: 'PATCH',
      body: input
    })
    await fetchFolders()
    return folder
  }

  /** 폴더를 삭제하고 목록을 갱신한다. */
  const deleteFolder = async (id: string) => {
    await $fetch(`/api/folders/${id}`, { method: 'DELETE' })
    await fetchFolders()
  }

  /** 폴더 정렬 순서를 변경하고 목록을 갱신한다. */
  const reorderFolders = async (parentId: string | null, orderedIds: string[]) => {
    await $fetch('/api/folders/reorder', {
      method: 'PATCH',
      body: { parentId, orderedIds }
    })
    await fetchFolders()
  }

  return {
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    reorderFolders
  }
}
