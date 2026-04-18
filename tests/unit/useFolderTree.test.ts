import { describe, it, expect, beforeEach } from 'vitest'
import { buildFolderMap, buildTree, findAncestors, flattenTree } from '~/composables/action/useFolderTree'
import { makeFolder, resetFactoryCounters } from '../helpers/factories'

beforeEach(() => resetFactoryCounters())

const folders = [
  makeFolder({ id: 'root', name: '루트', slug: 'root', sortOrder: 0 }),
  makeFolder({ id: 'child1', parentId: 'root', name: '자식1', slug: 'child1', sortOrder: 0 }),
  makeFolder({ id: 'child2', parentId: 'root', name: '자식2', slug: 'child2', sortOrder: 1 }),
  makeFolder({ id: 'grandchild', parentId: 'child1', name: '손자', slug: 'grandchild', sortOrder: 0 }),
  makeFolder({ id: 'other', name: '기타', slug: 'other', sortOrder: 1 })
]

describe('buildFolderMap', () => {
  it('모든 폴더를 id로 매핑한다', () => {
    const map = buildFolderMap(folders)
    expect(map.size).toBe(5)
    expect(map.get('root')?.name).toBe('루트')
    expect(map.get('grandchild')?.parentId).toBe('child1')
  })

  it('빈 배열이면 빈 맵을 반환한다', () => {
    expect(buildFolderMap([]).size).toBe(0)
  })
})

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

  it('고아 노드(부모가 없는 자식)를 루트로 승격한다', () => {
    const orphan = [makeFolder({ id: 'o', parentId: 'missing', name: '고아', slug: 'orphan' })]
    const tree = buildTree(orphan)
    expect(tree).toHaveLength(1)
    expect(tree[0].name).toBe('고아')
  })
})

describe('findAncestors', () => {
  it('손자 폴더의 조상을 root -> parent 순서로 반환한다', () => {
    const ancestors = findAncestors('grandchild', folders)
    expect(ancestors.map(a => a.id)).toEqual(['root', 'child1'])
  })

  it('루트 폴더는 조상이 없다', () => {
    expect(findAncestors('root', folders)).toEqual([])
  })

  it('존재하지 않는 ID면 빈 배열을 반환한다', () => {
    expect(findAncestors('nonexistent', folders)).toEqual([])
  })

  it('1단계 자식은 루트만 조상으로 갖는다', () => {
    const ancestors = findAncestors('child1', folders)
    expect(ancestors).toHaveLength(1)
    expect(ancestors[0].id).toBe('root')
  })

  it('순환 참조가 있어도 무한 루프에 빠지지 않는다', () => {
    const cyclic = [
      makeFolder({ id: 'x', parentId: 'y', name: 'X', slug: 'x' }),
      makeFolder({ id: 'y', parentId: 'x', name: 'Y', slug: 'y' })
    ]
    const ancestors = findAncestors('x', cyclic)
    expect(ancestors.length).toBeLessThanOrEqual(2)
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
