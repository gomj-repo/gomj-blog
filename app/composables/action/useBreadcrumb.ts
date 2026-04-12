import { useFolderStore } from '~/composables/store/useFolderStore'

/** 브레드크럼 항목. `to`가 없으면 현재 위치를 나타낸다. */
interface BreadcrumbItem {
  label: string
  to?: string
}

/** 현재 라우트에 따라 브레드크럼 항목 목록을 계산한다. */
export const useBreadcrumb = () => {
  const route = useRoute()
  const folderStore = useFolderStore()

  const items = computed<BreadcrumbItem[]>(() => {
    const result: BreadcrumbItem[] = [{ label: '홈', to: '/' }]
    const params = route.params

    // 태그 라우트
    if (route.path.startsWith('/tags')) {
      result.push({ label: '태그', to: '/tags' })
      if (params.id) {
        result.push({ label: String(params.id) })
      }
      return result
    }

    // 폴더 라우트
    if (params.folderSlug) {
      const folder = folderStore.folders.value.find(f => f.slug === params.folderSlug)
      result.push({
        label: folder?.name ?? String(params.folderSlug),
        to: `/folders/${params.folderSlug}`
      })

      if (params.pageSlug) {
        result.push({ label: String(params.pageSlug) })
      }
    }

    return result
  })

  return { items }
}
