import { describe, it, expect, beforeEach } from 'vitest'
import { buildSidebarTree } from '~/composables/action/useSidebarTree'
import { makeFolder, makePage, resetFactoryCounters } from '../helpers/factories'

beforeEach(() => resetFactoryCounters())

describe('buildSidebarTree', () => {
  const folders = [
    makeFolder({ id: 'f1', name: '개발', slug: 'dev', sortOrder: 0 }),
    makeFolder({ id: 'f2', parentId: 'f1', name: '백엔드', slug: 'backend', sortOrder: 0 }),
    makeFolder({ id: 'f3', name: '디자인', slug: 'design', sortOrder: 1 })
  ]

  const pages = [
    makePage({ id: 'p1', folderId: 'f1', title: 'Git 사용법', slug: 'git', sortOrder: 0 }),
    makePage({ id: 'p2', folderId: 'f2', title: 'API 설계', slug: 'api', sortOrder: 0 }),
    makePage({ id: 'p3', folderId: 'f1', parentPageId: 'p1', title: 'Git 브랜치', slug: 'git-branch', sortOrder: 0 })
  ]

  it('폴더와 페이지를 통합 트리로 구성한다', () => {
    const tree = buildSidebarTree(folders, pages)
    expect(tree).toHaveLength(2) // f1(개발), f3(디자인)
    expect(tree[0].type).toBe('folder')
    expect(tree[0].name).toBe('개발')
  })

  it('첫 번째 루트 폴더에 isHome을 설정한다', () => {
    const tree = buildSidebarTree(folders, pages)
    expect(tree[0].isHome).toBe(true)
    expect(tree[1].isHome).toBe(false)
  })

  it('폴더 내 children은 하위 폴더가 먼저, 페이지가 나중이다', () => {
    const tree = buildSidebarTree(folders, pages)
    const dev = tree[0]
    const childTypes = dev.children.map(c => c.type)
    const firstPageIndex = childTypes.indexOf('page')
    const lastFolderIndex = childTypes.lastIndexOf('folder')
    if (firstPageIndex >= 0 && lastFolderIndex >= 0) {
      expect(lastFolderIndex).toBeLessThan(firstPageIndex)
    }
  })

  it('하위 페이지를 상위 페이지 아래에 배치한다', () => {
    const tree = buildSidebarTree(folders, pages)
    const dev = tree[0]
    const gitPage = dev.children.find(c => c.type === 'page' && c.slug === 'git')!
    expect(gitPage.children).toHaveLength(1)
    expect(gitPage.children[0].name).toBe('Git 브랜치')
  })

  it('빈 데이터면 빈 트리를 반환한다', () => {
    expect(buildSidebarTree([], [])).toEqual([])
  })

  it('페이지 없이 폴더만 있어도 동작한다', () => {
    const tree = buildSidebarTree(folders, [])
    expect(tree).toHaveLength(2)
  })

  it('폴더 없이 페이지만 있으면 폴더 노드가 없으므로 페이지가 연결되지 않는다', () => {
    const tree = buildSidebarTree([], pages)
    expect(tree).toHaveLength(0)
  })

  it('모듈 추가 시 기존 트리 구조가 유지된다', () => {
    const extraFolder = makeFolder({ id: 'f4', parentId: 'f1', name: '프론트', slug: 'frontend', sortOrder: 1 })
    const extraPage = makePage({ id: 'p4', folderId: 'f4', title: 'Vue 가이드', slug: 'vue', sortOrder: 0 })

    const treeBefore = buildSidebarTree(folders, pages)
    const treeAfter = buildSidebarTree([...folders, extraFolder], [...pages, extraPage])

    // 기존 루트 구조 유지
    expect(treeAfter).toHaveLength(2)
    // 기존 폴더의 기존 자식 보존
    const devBefore = treeBefore[0]
    const devAfter = treeAfter[0]
    const beforeNames = devBefore.children.map(c => c.name)
    const afterNames = devAfter.children.map(c => c.name)
    for (const name of beforeNames) {
      expect(afterNames).toContain(name)
    }
    // 새 폴더 추가됨
    expect(afterNames).toContain('프론트')
  })
})
