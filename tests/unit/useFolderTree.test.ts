import { describe, it, expect } from 'vitest'
import { buildTree, findAncestors, flattenTree } from '~/composables/action/useFolderTree'
import type { SavedFolder } from '#shared/types/folder'

const makeFolder = (overrides: Partial<SavedFolder> & { id: string; name: string; slug: string }): SavedFolder => ({
  parentId: null,
  sortOrder: 0,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  ...overrides
})

const folders: SavedFolder[] = [
  makeFolder({ id: 'root', name: '루트', slug: 'root', sortOrder: 0 }),
  makeFolder({ id: 'child1', parentId: 'root', name: '자식1', slug: 'child1', sortOrder: 0 }),
  makeFolder({ id: 'child2', parentId: 'root', name: '자식2', slug: 'child2', sortOrder: 1 }),
  makeFolder({ id: 'grandchild', parentId: 'child1', name: '손자', slug: 'grandchild', sortOrder: 0 }),
  makeFolder({ id: 'other', name: '기타', slug: 'other', sortOrder: 1 })
]

describe('buildTree', () => {
  it('루트 폴더들을 최상위로 반환한다', () => {
    const tree = buildTree(folders)
    expect(tree).toHaveLength(2)
    expect(tree.map(n => n.name)).toEqual(['루트', '기타'])
  })

  it('자식 폴더를 올바른 부모 아래에 배치한다', () => {
    const tree = buildTree(folders)
    const root = tree.find(n => n.id === 'root')!
    expect(root.children).toHaveLength(2)
    expect(root.children.map(c => c.name)).toEqual(['자식1', '자식2'])
  })

  it('손자 폴더를 올바르게 중첩한다', () => {
    const tree = buildTree(folders)
    const root = tree.find(n => n.id === 'root')!
    const child1 = root.children.find(c => c.id === 'child1')!
    expect(child1.children).toHaveLength(1)
    expect(child1.children[0].name).toBe('손자')
  })

  it('빈 배열이면 빈 트리를 반환한다', () => {
    expect(buildTree([])).toEqual([])
  })
})

describe('findAncestors', () => {
  it('손자 폴더의 조상을 root -> parent 순서로 반환한다', () => {
    const ancestors = findAncestors('grandchild', folders)
    expect(ancestors.map(a => a.id)).toEqual(['root', 'child1'])
  })

  it('루트 폴더는 조상이 없다', () => {
    const ancestors = findAncestors('root', folders)
    expect(ancestors).toEqual([])
  })

  it('존재하지 않는 ID면 빈 배열을 반환한다', () => {
    const ancestors = findAncestors('nonexistent', folders)
    expect(ancestors).toEqual([])
  })

  it('1단계 자식은 루트만 조상으로 갖는다', () => {
    const ancestors = findAncestors('child1', folders)
    expect(ancestors).toHaveLength(1)
    expect(ancestors[0].id).toBe('root')
  })
})

describe('flattenTree', () => {
  it('트리를 깊이 우선으로 펼친다', () => {
    const tree = buildTree(folders)
    const flat = flattenTree(tree)
    expect(flat).toHaveLength(folders.length)
    expect(flat.map(f => f.id)).toEqual(['root', 'child1', 'grandchild', 'child2', 'other'])
  })

  it('빈 트리는 빈 배열을 반환한다', () => {
    expect(flattenTree([])).toEqual([])
  })

  it('펼친 결과에 children 속성이 없다', () => {
    const tree = buildTree(folders)
    const flat = flattenTree(tree)
    for (const item of flat) {
      expect(item).not.toHaveProperty('children')
    }
  })
})
