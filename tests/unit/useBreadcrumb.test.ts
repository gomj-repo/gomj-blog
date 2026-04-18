import { describe, it, expect, beforeEach } from 'vitest'
import { buildBreadcrumb, collapseBreadcrumb } from '~/composables/action/useBreadcrumb'
import { makeFolder, resetFactoryCounters } from '../helpers/factories'

beforeEach(() => resetFactoryCounters())

const folders = [
  makeFolder({ id: 'root', name: '개발', slug: 'dev' }),
  makeFolder({ id: 'be', parentId: 'root', name: '백엔드', slug: 'backend' }),
  makeFolder({ id: 'api', parentId: 'be', name: 'API 설계', slug: 'api-design' })
]

describe('buildBreadcrumb', () => {
  it('루트 폴더에서 홈 + 폴더 1개를 반환한다', () => {
    const result = buildBreadcrumb(folders, 'root')
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ label: '홈', to: '/' })
    expect(result[1]).toMatchObject({ label: '개발', icon: 'i-lucide-folder' })
    expect(result[1]).not.toHaveProperty('to')
  })

  it('깊은 폴더에서 전체 체인을 반환한다', () => {
    const result = buildBreadcrumb(folders, 'api')
    expect(result).toHaveLength(4)
    expect(result.map(r => r.label)).toEqual(['홈', '개발', '백엔드', 'API 설계'])
  })

  it('pageTitle이 있으면 마지막에 페이지 항목을 추가한다', () => {
    const result = buildBreadcrumb(folders, 'be', 'REST 가이드')
    expect(result).toHaveLength(4)
    expect(result[3]).toMatchObject({ label: 'REST 가이드', icon: 'i-lucide-file-text' })
    expect(result[3]).not.toHaveProperty('to')
  })

  it('존재하지 않는 folderId면 홈만 반환한다', () => {
    const result = buildBreadcrumb(folders, 'nonexistent')
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('홈')
  })

  it('빈 폴더 배열이면 홈만 반환한다', () => {
    const result = buildBreadcrumb([], 'any')
    expect(result).toHaveLength(1)
  })

  it('폴더 항목에는 to 속성이 없다 (라우트 없음)', () => {
    const result = buildBreadcrumb(folders, 'api')
    const folderItems = result.slice(1)
    for (const item of folderItems) {
      expect(item).not.toHaveProperty('to')
    }
  })

  it('순환 참조가 있어도 무한 루프에 빠지지 않는다', () => {
    const cyclic = [
      makeFolder({ id: 'a', parentId: 'b', name: 'A', slug: 'a' }),
      makeFolder({ id: 'b', parentId: 'a', name: 'B', slug: 'b' })
    ]
    const result = buildBreadcrumb(cyclic, 'a')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.length).toBeLessThanOrEqual(4)
  })
})

describe('collapseBreadcrumb', () => {
  const items = [
    { label: '홈' },
    { label: '개발' },
    { label: '백엔드' },
    { label: 'API 설계' },
    { label: '문서' }
  ]

  it('maxVisible 이하면 원본을 그대로 반환한다', () => {
    const result = collapseBreadcrumb(items, 5)
    expect(result).toBe(items)
  })

  it('maxVisible 초과 시 홈 + ... + 마지막 항목들로 축약한다', () => {
    const result = collapseBreadcrumb(items, 3)
    expect(result).toHaveLength(3)
    expect(result[0].label).toBe('홈')
    expect(result[1]).toMatchObject({ label: '...', disabled: true })
    expect(result[2].label).toBe('문서')
  })

  it('기본 maxVisible은 3이다', () => {
    const result = collapseBreadcrumb(items)
    expect(result).toHaveLength(3)
  })

  it('항목이 1개면 축약하지 않는다', () => {
    const single = [{ label: '홈' }]
    expect(collapseBreadcrumb(single, 3)).toBe(single)
  })

  it('빈 배열이면 그대로 반환한다', () => {
    expect(collapseBreadcrumb([], 3)).toEqual([])
  })
})
