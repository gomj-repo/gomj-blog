import type { SavedPage } from '#shared/types/page'
import type { CreatePageInput, UpdatePageInput } from '#shared/schemas/page.schema'
import { usePageStore } from '~/composables/store/usePageStore'

export const usePageApi = () => {
  const store = usePageStore()

  /** 특정 폴더의 페이지 목록을 가져와 스토어에 반영한다. */
  const fetchPages = async (folderId: string) => {
    const data = await $fetch<SavedPage[]>('/api/pages', {
      params: { folderId }
    })
    store.setPageList(data)
    return data
  }

  /** ID로 페이지를 가져와 스토어에 반영한다. */
  const fetchPage = async (id: string) => {
    const data = await $fetch<SavedPage>(`/api/pages/${id}`)
    store.setCurrentPage(data)
    return data
  }

  /** 새 페이지를 생성한다. */
  const createPage = async (input: CreatePageInput) => {
    const page = await $fetch<SavedPage>('/api/pages', {
      method: 'POST',
      body: input
    })
    return page
  }

  /** 페이지를 수정하고 스토어를 갱신한다. */
  const updatePage = async (id: string, input: Partial<UpdatePageInput>) => {
    const page = await $fetch<SavedPage>(`/api/pages/${id}`, {
      method: 'PATCH',
      body: input
    })
    store.setCurrentPage(page)
    return page
  }

  /** 페이지를 삭제하고 스토어를 초기화한다. */
  const deletePage = async (id: string) => {
    await $fetch(`/api/pages/${id}`, { method: 'DELETE' })
    store.setCurrentPage(null)
  }

  /** 최근 공개 페이지를 가져와 스토어에 반영한다. */
  const fetchRecentPages = async () => {
    const data = await $fetch<SavedPage[]>('/api/pages/recent')
    store.setRecentPages(data)
    return data
  }

  /** 전체 페이지 목록을 가져와 사이드바 트리용 스토어에 반영한다. */
  const fetchAllPages = async () => {
    const data = await $fetch<SavedPage[]>('/api/pages')
    store.setAllPages(data)
    return data
  }

  return {
    fetchPages,
    fetchPage,
    createPage,
    updatePage,
    deletePage,
    fetchRecentPages,
    fetchAllPages
  }
}
