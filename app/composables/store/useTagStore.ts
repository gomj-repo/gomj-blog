import type { SavedTag } from '#shared/types/tag'

export const useTagStore = () => {
  /** 전체 태그 목록. */
  const allTags = useState<SavedTag[]>('all-tags', () => [])
  /** 현재 페이지에 연결된 태그 목록. */
  const currentPageTags = useState<SavedTag[]>('current-page-tags', () => [])

  const setAllTags = (value: SavedTag[]) => {
    allTags.value = value
  }

  const setCurrentPageTags = (value: SavedTag[]) => {
    currentPageTags.value = value
  }

  return {
    allTags,
    currentPageTags,
    setAllTags,
    setCurrentPageTags
  }
}
