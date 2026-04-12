import type { SavedPage } from '#shared/types/page'

export interface PageTreeNode extends SavedPage {
  children: PageTreeNode[]
}

export const buildPageTree = (pages: SavedPage[]): PageTreeNode[] => {
  const map = new Map<string, PageTreeNode>()
  const roots: PageTreeNode[] = []

  for (const page of pages) {
    map.set(page.id, { ...page, children: [] })
  }

  for (const page of pages) {
    const node = map.get(page.id)!
    if (page.parentPageId) {
      const parent = map.get(page.parentPageId)
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
