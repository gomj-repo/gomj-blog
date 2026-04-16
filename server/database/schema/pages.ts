import { pgTable, text, varchar, integer, boolean, timestamp, index, jsonb } from 'drizzle-orm/pg-core'
import { folders } from './folders'

/** 페이지 테이블. 폴더에 속하는 콘텐츠 단위이다. */
export const pages = pgTable('pages', {
  /** 페이지 고유 ID (UUID) */
  id: text('id').primaryKey(),
  /** 소속 폴더 ID. 폴더 삭제 시 함께 제거된다. */
  folderId: text('folder_id')
    .notNull()
    .references(() => folders.id, { onDelete: 'cascade' }),
  /** 페이지 제목 */
  title: varchar('title', { length: 500 }).notNull(),
  /** URL 경로에 사용되는 슬러그 */
  slug: varchar('slug', { length: 500 }).notNull(),
  /** TipTap JSON 형식의 본문 */
  content: jsonb('content'),
  /** 검색 인덱싱용 평문 텍스트 */
  plainText: text('plain_text'),
  /** 공개 여부. `false`이면 관리자만 조회 가능. */
  isPublic: boolean('is_public').notNull().default(true),
  /** 페이지 상태. draft(초안) / published(게시) / archived(보관). */
  status: varchar('status', { length: 20 }).notNull().default('published'),
  /** 폴더 내 정렬 순서 */
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date())
}, (table) => [
  index('page_folder_idx').on(table.folderId),
  index('page_slug_idx').on(table.slug),
  index('page_public_idx').on(table.isPublic)
])
