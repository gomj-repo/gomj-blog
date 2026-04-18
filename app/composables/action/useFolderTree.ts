import type { SavedFolder } from '#shared/types/folder'

/** 트리 구조를 위한 폴더 노드. 자식 목록을 포함한다. */
export interface FolderTreeNode extends SavedFolder {
  children: FolderTreeNode[]
}

/** flat 배열에서 id → folder 맵을 생성한다. */
export const buildFolderMap = (folders: SavedFolder[]): Map<string, SavedFolder> => {
  const map = new Map<string, SavedFolder>()
  for (const folder of folders) {
    map.set(folder.id, folder)
  }
  return map
}

/** flat 배열을 트리 구조로 변환한다. */
export const buildTree = (folders: SavedFolder[]): FolderTreeNode[] => {
  const map = new Map<string, FolderTreeNode>()
  const roots: FolderTreeNode[] = []

  for (const folder of folders) {
    map.set(folder.id, { ...folder, children: [] })
  }

  for (const folder of folders) {
    const node = map.get(folder.id)!
    if (folder.parentId) {
      const parent = map.get(folder.parentId)
      if (parent) {
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }

  return roots
}

/** 특정 폴더의 조상 목록을 반환한다 (root -> ... -> parent 순서). */
export const findAncestors = (id: string, folders: SavedFolder[]): SavedFolder[] => {
  const map = buildFolderMap(folders)

  const ancestors: SavedFolder[] = []
  const visited = new Set<string>()
  let current = map.get(id)

  while (current?.parentId) {
    if (visited.has(current.parentId)) break
    visited.add(current.parentId)
    const parent = map.get(current.parentId)
    if (!parent) break
    ancestors.unshift(parent)
    current = parent
  }

  return ancestors
}

/** 트리를 다시 flat 배열로 변환한다 (깊이 우선). */
export const flattenTree = (tree: FolderTreeNode[]): SavedFolder[] => {
  const result: SavedFolder[] = []

  const walk = (nodes: FolderTreeNode[]) => {
    for (const node of nodes) {
      const { children: _, ...folder } = node
      result.push(folder)
      walk(node.children)
    }
  }

  walk(tree)
  return result
}

export const useFolderTree = () => {
  return {
    buildTree,
    findAncestors,
    flattenTree
  }
}
