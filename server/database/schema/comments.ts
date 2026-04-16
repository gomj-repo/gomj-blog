import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core'
import { pages } from './pages'
import { users } from './users'

/** 댓글 테이블. 페이지에 달린 댓글과 대댓글을 저장한다. */
export const comments = pgTable('comments', {
  /** 댓글 고유 ID (UUID) */
  id: text('id').primaryKey(),
  /** 댓글이 달린 페이지 ID. 페이지 삭제 시 함께 제거된다. */
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  /** 작성자 사용자 ID. 사용자 삭제 시 함께 제거된다. */
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  /** 부모 댓글 ID. `null`이면 최상위 댓글, 값이 있으면 대댓글이다. */
  parentId: text('parent_id'),
  /** 댓글 본문 */
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date())
}, (table) => [
  index('comment_page_idx').on(table.pageId),
  index('comment_user_idx').on(table.userId),
  index('comment_parent_idx').on(table.parentId)
])
