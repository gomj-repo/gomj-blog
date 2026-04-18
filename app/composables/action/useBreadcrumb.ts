import type { BreadcrumbItem } from '@nuxt/ui'
import type { SavedFolder } from '#shared/types/folder'

export type { BreadcrumbItem }

/**
 * 폴더 계층에서 NuxtUI UBreadcrumb에 전달할 아이템 배열을 생성한다.
 * 루트부터 현재 위치까지의 폴더 체인을 반환한다.
 */
export function buildBreadcrumb(
  folders: SavedFolder[],
  currentFolderId: string,
  pageTitle?: string
): BreadcrumbItem[] {
  const folderMap = new Map<string, SavedFolder>()
  for (const folder of folders) {
    folderMap.set(folder.id, folder)
  }

  const chain: SavedFolder[] = []
  let current = folderMap.get(currentFolderId)
  while (current) {
    chain.push(current)
    current = current.parentId ? folderMap.get(current.parentId) : undefined
  }
  chain.reverse()

  const result: BreadcrumbItem[] = [
    { label: '홈', icon: 'i-lucide-house', to: '/' }
  ]

  for (const folder of chain) {
    result.push({
      label: folder.name,
      icon: 'i-lucide-folder'
    })
  }

  if (pageTitle !== undefined) {
    result.push({
      label: pageTitle,
      icon: 'i-lucide-file-text'
    })
  }

  return result
}

/**
 * 모바일에서 브레드크럼을 축약한다.
 * 항목이 maxVisible보다 많으면 홈 + '...' + 마지막 (maxVisible - 2)개만 표시한다.
 */
export function collapseBreadcrumb(
  items: BreadcrumbItem[],
  maxVisible: number = 3
): BreadcrumbItem[] {
  if (items.length <= maxVisible) return items

  const home = items[0]
  const tail = items.slice(-(maxVisible - 2))

  return [
    home,
    { label: '...', disabled: true },
    ...tail
  ]
}
