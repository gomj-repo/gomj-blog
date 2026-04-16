import { pgTable, text, timestamp, primaryKey, index } from 'drizzle-orm/pg-core'
import { pages } from './pages'
import { users } from './users'

/** 북마크 테이블. 사용자가 특정 페이지를 즐겨찾기에 추가한 관계를 나타낸다. */
export const bookmarks = pgTable('bookmarks', {
  /** 북마크를 등록한 사용자 ID */
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  /** 북마크된 페이지 ID */
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  /** 북마크 등록 시각 */
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (table) => [
  primaryKey({ columns: [table.userId, table.pageId] }),
  index('bookmark_user_idx').on(table.userId),
  index('bookmark_page_idx').on(table.pageId)
])
