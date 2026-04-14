import type { SavedFolder } from '#shared/types/folder'
import type { SavedPage } from '#shared/types/page'

export type SidebarNodeType = 'folder' | 'page' | 'home'

export interface SidebarTreeNode {
  id: string
  name: string
  slug: string
  type: SidebarNodeType
  children: SidebarTreeNode[]
  folderId?: string
  parentPageId?: string | null
  parentId?: string | null
  isHome?: boolean
}

export const buildSidebarTree = (folders: SavedFolder[], pages: SavedPage[]): SidebarTreeNode[] => {
  // 1. 폴더 Map 구성
  const rootFolders = folders.filter(f => f.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder)
  const homeFolderId = rootFolders[0]?.id

  const folderMap = new Map<string, SidebarTreeNode>()

  for (const folder of folders) {
    folderMap.set(folder.id, {
      id: folder.id,
      name: folder.name,
      slug: folder.slug,
      type: 'folder',
      children: [],
      parentId: folder.parentId,
      isHome: folder.id === homeFolderId
    })
  }

  // 2. 폴더 트리 구성 (하위 폴더 연결)
  const roots: SidebarTreeNode[] = []

  for (const folder of folders) {
    const node = folderMap.get(folder.id)!
    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId)
      if (parent) {
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }

  // 3. 페이지 Map 구성
  const pageMap = new Map<string, SidebarTreeNode>()

  for (const page of pages) {
    pageMap.set(page.id, {
      id: page.id,
      name: page.title,
      slug: page.slug,
      type: 'page',
      children: [],
      folderId: page.folderId,
      parentPageId: page.parentPageId
    })
  }

  // 4. 루트 페이지를 해당 폴더에 추가, 하위 페이지를 상위 페이지에 추가
  const rootPages = pages.filter(p => p.parentPageId === null).sort((a, b) => a.sortOrder - b.sortOrder)
  const childPages = pages.filter(p => p.parentPageId !== null).sort((a, b) => a.sortOrder - b.sortOrder)

  for (const page of rootPages) {
    const folderNode = folderMap.get(page.folderId)
    if (folderNode) {
      folderNode.children.push(pageMap.get(page.id)!)
    }
  }

  for (const page of childPages) {
    const parentNode = pageMap.get(page.parentPageId!)
    if (parentNode) {
      parentNode.children.push(pageMap.get(page.id)!)
    }
  }

  // 5. 폴더 children 정렬: 하위 폴더 먼저 (sortOrder), 그 다음 페이지 (sortOrder)
  const sortChildren = (node: SidebarTreeNode) => {
    const subFolders = node.children.filter(c => c.type === 'folder')
    const subPages = node.children.filter(c => c.type === 'page')
    node.children = [...subFolders, ...subPages]
    for (const child of node.children) {
      sortChildren(child)
    }
  }

  for (const root of roots) {
    sortChildren(root)
  }

  return roots
}
