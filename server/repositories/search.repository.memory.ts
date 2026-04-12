import type { ISearchRepository } from './search.repository'
import type { SearchResult } from '#shared/types/search'
import { pageRepository } from './page.repository.memory'

/** 검색어 주변 텍스트를 잘라 스니펫을 생성한다. */
function extractSnippet(text: string | null, query: string): string {
  if (!text) return ''
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)
  if (index === -1) return text.slice(0, 150)
  const start = Math.max(0, index - 40)
  const end = Math.min(text.length, index + query.length + 40)
  let snippet = text.slice(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'
  return snippet
}

/**
 * 인메모리 검색 저장소. 공개 페이지를 순회하며 제목·본문에서 키워드를 찾는다.
 * 메모리 모드에서는 비공개 페이지 검색에 한계가 있다.
 */
class InMemorySearchRepository implements ISearchRepository {
  async searchPages(query: string, includePrivate: boolean, limit = 20): Promise<SearchResult[]> {
    const allPublic = await pageRepository.listPublicPages(9999)
    let allPages = allPublic
    if (includePrivate) {
      // 메모리 모드에서는 폴더 컨텍스트 없이 전체 페이지를 열거할 수 없으므로
      // 공개 페이지만 대상으로 검색한다 (개발 환경 제약).
      allPages = allPublic
    }

    const q = query.toLowerCase()
    const results: SearchResult[] = []

    for (const page of allPages) {
      const titleMatch = page.title.toLowerCase().includes(q)
      const contentMatch = page.plainText?.toLowerCase().includes(q) ?? false

      if (!titleMatch && !contentMatch) continue

      results.push({
        id: page.id,
        folderId: page.folderId,
        title: page.title,
        slug: page.slug,
        plainText: page.plainText,
        isPublic: page.isPublic,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        snippet: extractSnippet(page.plainText, query),
        matchField: titleMatch && contentMatch ? 'both' : titleMatch ? 'title' : 'content'
      })
    }

    return results
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
  }
}

export const searchRepository: ISearchRepository = new InMemorySearchRepository()
