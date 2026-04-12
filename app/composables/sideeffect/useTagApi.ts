import type { SavedTag } from '#shared/types/tag'
import { useTagStore } from '~/composables/store/useTagStore'

export const useTagApi = () => {
  const store = useTagStore()

  /** 전체 태그 목록을 가져와 스토어에 반영한다. */
  const fetchTags = async () => {
    const data = await $fetch<SavedTag[]>('/api/tags')
    store.setAllTags(data)
    return data
  }

  /** 새 태그를 생성하고 스토어에 추가한다. */
  const createTag = async (name: string) => {
    const tag = await $fetch<SavedTag>('/api/tags', {
      method: 'POST',
      body: { name }
    })
    store.setAllTags([...store.allTags.value, tag])
    return tag
  }

  /** 태그를 삭제하고 스토어에서 제거한다. */
  const deleteTag = async (id: string) => {
    await $fetch(`/api/tags/${id}`, { method: 'DELETE' })
    store.setAllTags(store.allTags.value.filter(t => t.id !== id))
  }

  /** 특정 페이지에 연결된 태그 목록을 가져온다. */
  const fetchTagsByPage = async (pageId: string) => {
    const data = await $fetch<SavedTag[]>(`/api/pages/${pageId}/tags`)
    store.setCurrentPageTags(data)
    return data
  }

  /**
   * 페이지에 태그를 연결한다.
   * @param pageId - 대상 페이지 ID
   * @param tagId - 연결할 태그 ID
   */
  const addTagToPage = async (pageId: string, tagId: string) => {
    await $fetch(`/api/pages/${pageId}/tags`, {
      method: 'POST',
      body: { tagId }
    })
    const tag = store.allTags.value.find(t => t.id === tagId)
    if (tag) {
      store.setCurrentPageTags([...store.currentPageTags.value, tag])
    }
  }

  /**
   * 페이지에서 태그 연결을 해제한다.
   * @param pageId - 대상 페이지 ID
   * @param tagId - 해제할 태그 ID
   */
  const removeTagFromPage = async (pageId: string, tagId: string) => {
    await $fetch(`/api/pages/${pageId}/tags/${tagId}`, { method: 'DELETE' })
    store.setCurrentPageTags(store.currentPageTags.value.filter(t => t.id !== tagId))
  }

  return {
    fetchTags,
    createTag,
    deleteTag,
    fetchTagsByPage,
    addTagToPage,
    removeTagFromPage
  }
}
