import { describe, it, expect, beforeEach } from 'vitest'
import { buildPageTree } from '~/composables/action/usePageTree'
import { makePage, resetFactoryCounters } from '../helpers/factories'

beforeEach(() => resetFactoryCounters())

describe('buildPageTree', () => {
  it('루트 페이지를 최상위로 반환한다', () => {
    const pages = [
      makePage({ id: 'p1', title: '페이지1', slug: 'p1', folderId: 'f1' }),
      makePage({ id: 'p2', title: '페이지2', slug: 'p2', folderId: 'f1' })
    ]
    const tree = buildPageTree(pages)
    expect(tree).toHaveLength(2)
  })

  it('하위 페이지를 부모 아래에 배치한다', () => {
    const pages = [
      makePage({ id: 'parent', title: '부모', slug: 'parent', folderId: 'f1' }),
      makePage({ id: 'child', parentPageId: 'parent', title: '자식', slug: 'child', folderId: 'f1' })
    ]
    const tree = buildPageTree(pages)
    expect(tree).toHaveLength(1)
    expect(tree[0].children).toHaveLength(1)
    expect(tree[0].children[0].title).toBe('자식')
  })

  it('3단계 중첩을 올바르게 처리한다', () => {
    const pages = [
      makePage({ id: 'l1', title: 'L1', slug: 'l1', folderId: 'f1' }),
      makePage({ id: 'l2', parentPageId: 'l1', title: 'L2', slug: 'l2', folderId: 'f1' }),
      makePage({ id: 'l3', parentPageId: 'l2', title: 'L3', slug: 'l3', folderId: 'f1' })
    ]
    const tree = buildPageTree(pages)
    expect(tree[0].children[0].children[0].title).toBe('L3')
  })

  it('빈 배열이면 빈 트리를 반환한다', () => {
    expect(buildPageTree([])).toEqual([])
  })

  it('고아 페이지(부모가 없는 자식)를 루트로 승격한다', () => {
    const pages = [
      makePage({ id: 'o', parentPageId: 'missing', title: '고아', slug: 'orphan', folderId: 'f1' })
    ]
    const tree = buildPageTree(pages)
    expect(tree).toHaveLength(1)
    expect(tree[0].title).toBe('고아')
  })
})
