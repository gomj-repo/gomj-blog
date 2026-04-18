import type { SavedFolder } from '#shared/types/folder'
import type { SavedPage } from '#shared/types/page'

let _folderId = 0
let _pageId = 0

/** 테스트용 폴더 팩토리. 필수 필드만 지정하면 나머지는 기본값으로 채운다. */
export const makeFolder = (
  overrides: Partial<SavedFolder> & { name: string; slug: string }
): SavedFolder => ({
  id: `folder-${++_folderId}`,
  parentId: null,
  sortOrder: 0,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  ...overrides
})

/** 테스트용 페이지 팩토리. 필수 필드만 지정하면 나머지는 기본값으로 채운다. */
export const makePage = (
  overrides: Partial<SavedPage> & { title: string; slug: string; folderId: string }
): SavedPage => ({
  id: `page-${++_pageId}`,
  parentPageId: null,
  content: null,
  plainText: null,
  isPublic: true,
  status: 'published',
  sortOrder: 0,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  ...overrides
})

/** TipTap JSON 문서 팩토리. 노드 배열을 받아 doc으로 감싼다. */
export const makeTiptapDoc = (content: Record<string, unknown>[]) => ({
  type: 'doc',
  content
})

/** TipTap 헤딩 노드 생성. */
export const makeTiptapHeading = (level: number, text: string) => ({
  type: 'heading',
  attrs: { level },
  content: [{ type: 'text', text }]
})

/** TipTap 단락 노드 생성. */
export const makeTiptapParagraph = (text: string) => ({
  type: 'paragraph',
  content: [{ type: 'text', text }]
})

/** 팩토리 ID 카운터 초기화. beforeEach에서 호출하여 테스트 간 격리를 보장한다. */
export const resetFactoryCounters = () => {
  _folderId = 0
  _pageId = 0
}
