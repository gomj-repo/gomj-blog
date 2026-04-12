import type { SavedPage } from '#shared/types/page'

export const usePageStore = () => {
  /** 현재 보고 있는 페이지. */
  const currentPage = useState<SavedPage | null>('current-page', () => null)
  /** 현재 폴더의 페이지 목록. */
  const pageList = useState<SavedPage[]>('page-list', () => [])
  /** 홈에 표시할 최근 페이지 목록. */
  const recentPages = useState<SavedPage[]>('recent-pages', () => [])
  /** 사이드바 트리용 전체 페이지 목록. */
  const allPages = useState<SavedPage[]>('all-pages', () => [])

  const setCurrentPage = (value: SavedPage | null) => {
    currentPage.value = value
  }

  const setPageList = (value: SavedPage[]) => {
    pageList.value = value
  }

  const setRecentPages = (value: SavedPage[]) => {
    recentPages.value = value
  }

  const setAllPages = (value: SavedPage[]) => {
    allPages.value = value
  }

  return {
    currentPage,
    pageList,
    recentPages,
    allPages,
    setCurrentPage,
    setPageList,
    setRecentPages,
    setAllPages
  }
}
