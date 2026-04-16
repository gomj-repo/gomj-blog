export interface BreadcrumbItem {
  id: string
  name: string
  slug: string
  path: string
  type: 'home' | 'folder' | 'page'
}

export interface FolderNode {
  id: string
  parentId: string | null
  name: string
  slug: string
}

/**
 * 폴더 계층에서 브레드크럼 경로를 생성한다.
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
    { id: 'home', name: '홈', slug: '', path: '/', type: 'home' }
  ]

  let cumulativePath = ''
  for (const folder of chain) {
    cumulativePath += `/${folder.slug}`
    result.push({
      id: folder.id,
      name: folder.name,
      slug: folder.slug,
      path: cumulativePath,
      type: 'folder'
    })
  }

  if (pageTitle !== undefined) {
    const lastFolder = chain[chain.length - 1]
    result.push({
      id: 'page',
      name: pageTitle,
      slug: '',
      path: cumulativePath,
      type: 'page'
    })
  }

  return result
}
