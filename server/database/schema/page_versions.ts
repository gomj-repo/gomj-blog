import { pgTable, text, varchar, integer, timestamp, index, jsonb } from 'drizzle-orm/pg-core'
import { pages } from './pages'

/** 페이지 버전 이력 테이블. 페이지 수정 시 이전 내용을 스냅샷으로 보관한다. */
export const pageVersions = pgTable('page_versions', {
  /** 버전 고유 ID (UUID) */
  id: text('id').primaryKey(),
  /** 원본 페이지 ID. 페이지 삭제 시 함께 제거된다. */
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  /** 버전 번호. 같은 페이지 내에서 단조 증가한다. */
  versionNumber: integer('version_number').notNull(),
  /** 해당 시점의 페이지 제목 */
  title: varchar('title', { length: 500 }).notNull(),
  /** 해당 시점의 TipTap JSON 본문 */
  content: jsonb('content'),
  /** 해당 시점의 검색 인덱싱용 평문 텍스트 */
  plainText: text('plain_text'),
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (table) => [
  index('page_version_page_idx').on(table.pageId),
  index('page_version_number_idx').on(table.pageId, table.versionNumber)
])
