import { pgTable, text, varchar, timestamp, primaryKey, index } from 'drizzle-orm/pg-core'
import { pages } from './pages'

/** 태그 테이블. 페이지에 부여할 수 있는 분류 라벨. */
export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  /** 태그 표시 이름 (유니크) */
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

/** 페이지-태그 다대다 관계 중간 테이블. */
export const pageTags = pgTable('page_tags', {
  /** 연결 대상 페이지 ID */
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  /** 연결 대상 태그 ID */
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' })
}, (table) => [
  primaryKey({ columns: [table.pageId, table.tagId] }),
  index('page_tag_page_idx').on(table.pageId),
  index('page_tag_tag_idx').on(table.tagId)
])
