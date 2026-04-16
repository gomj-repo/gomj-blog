import type { BreadcrumbItem } from '@nuxt/ui'

export type { BreadcrumbItem }

export interface FolderNode {
  id: string
  parentId: string | null
  name: string
  slug: string
}

/**
 * 폴더 계층에서 NuxtUI UBreadcrumb에 전달할 아이템 배열을 생성한다.
 * 루트부터 현재 위치까지의 폴더 체인을 반환한다.
 */
export function buildBreadcrumb(
  folders: FolderNode[],
  currentFolderId: string,
  pageTitle?: string
): BreadcrumbItem[] {
  const folderMap = new Map<string, FolderNode>()
  for (const folder of folders) {
    folderMap.set(folder.id, folder)
  }

  const chain: FolderNode[] = []
  let current = folderMap.get(currentFolderId)
  while (current) {
    chain.push(current)
    current = current.parentId ? folderMap.get(current.parentId) : undefined
  }
  chain.reverse()

  const result: BreadcrumbItem[] = [
    { label: '홈', icon: 'i-lucide-house', to: '/' }
  ]

  let cumulativePath = ''
  for (const folder of chain) {
    cumulativePath += `/${folder.slug}`
    result.push({
      label: folder.name,
      icon: 'i-lucide-folder',
      to: cumulativePath
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
