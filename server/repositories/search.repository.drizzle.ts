import { ilike, or, eq, desc, and } from 'drizzle-orm'
import type { SearchResult } from '#shared/types/search'
import type { ISearchRepository } from './search.repository'
import { db as _db } from '../utils/db'
import { pages } from '../database/schema/pages'

/** DB 연결이 없으면 에러를 던진다. */
function getDb() {
  if (!_db) throw new Error('DrizzleSearchRepository requires a database connection')
  return _db
}

/** 검색어 주변 텍스트를 잘라 스니펫을 생성한다. */
function extractSnippet(text: string | null, query: string): string {
  if (!text) return ''
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, 80)

  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + query.length + 40)
  let snippet = text.slice(start, end)

  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'

  return snippet
}

/** 제목·본문 중 어디에서 매칭되었는지 판별한다. */
function determineMatchField(title: string, plainText: string | null, query: string): 'title' | 'content' | 'both' {
  const q = query.toLowerCase()
  const titleMatch = title.toLowerCase().includes(q)
  const contentMatch = plainText?.toLowerCase().includes(q) ?? false

  if (titleMatch && contentMatch) return 'both'
  if (titleMatch) return 'title'
  return 'content'
}

/** Postgres ILIKE 기반 검색 저장소 구현체. */
class DrizzleSearchRepository implements ISearchRepository {
  async searchPages(query: string, includePrivate: boolean, limit = 20): Promise<SearchResult[]> {
    const pattern = `%${query}%`

    const conditions = [
      or(
        ilike(pages.title, pattern),
        ilike(pages.plainText, pattern)
      )
    ]

    if (!includePrivate) {
      conditions.push(eq(pages.isPublic, true))
    }

    const rows = await getDb()
      .select()
      .from(pages)
      .where(and(...conditions))
      .orderBy(desc(pages.updatedAt))
      .limit(limit)

    return rows.map(row => ({
      id: row.id,
      folderId: row.folderId,
      title: row.title,
      slug: row.slug,
      plainText: row.plainText,
      isPublic: row.isPublic,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      snippet: extractSnippet(row.plainText || row.title, query),
      matchField: determineMatchField(row.title, row.plainText, query)
    }))
  }
}

export const searchRepository: ISearchRepository = new DrizzleSearchRepository()
