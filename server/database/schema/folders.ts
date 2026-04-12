import { pgTable, text, varchar, integer, timestamp, index, unique } from 'drizzle-orm/pg-core'

/** 폴더 테이블. 트리 구조를 `parentId` 자기참조로 표현한다. */
export const folders = pgTable('folders', {
  /** 폴더 고유 ID (UUID) */
  id: text('id').primaryKey(),
  /** 상위 폴더 ID. `null`이면 루트 폴더. 삭제 시 하위도 함께 제거된다. */
  parentId: text('parent_id')
    .references(() => folders.id, { onDelete: 'cascade' }),
  /** 폴더 표시 이름 */
  name: varchar('name', { length: 255 }).notNull(),
  /** URL 경로에 사용되는 슬러그 */
  slug: varchar('slug', { length: 255 }).notNull(),
  /** 같은 레벨 내 정렬 순서 */
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date())
}, (table) => [
  index('folder_parent_idx').on(table.parentId),
  index('folder_slug_idx').on(table.slug),
  unique('folder_parent_slug_uniq').on(table.parentId, table.slug)
])
